import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface CallData {
  id: string;
  caller_id: string;
  callee_id: string;
  status: 'calling' | 'ringing' | 'connected' | 'ended' | 'declined';
  created_at: string;
  offer?: RTCSessionDescriptionInit;
  caller_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export const useWebRTC = () => {
  const { user } = useProfile();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<CallData | null>(null);
  const [activeCall, setActiveCall] = useState<CallData | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize media stream
  const initializeMedia = useCallback(async (video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(rtcConfig);
    
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            from_user_id: user?.id
          }
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsCallActive(true);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [user?.id]);

  // Start a call
  const startCall = useCallback(async (calleeId: string) => {
    try {
      console.log('Starting call to user:', calleeId);
      
      // Create call record in database (using any for now until types update)
      const { data: callData, error } = await (supabase as any)
        .from('calls')
        .insert({
          caller_id: user?.id,
          callee_id: calleeId,
          status: 'calling'
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Call record created:', callData);

      setOutgoingCall(callData as CallData);

      // Initialize media and peer connection
      const stream = await initializeMedia();
      const pc = createPeerConnection();

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('Created offer:', offer);

      // Send offer through realtime channel - create a new channel for the callee
      const callChannel = supabase.channel(`calls:${calleeId}`);
      await callChannel.subscribe();
      
      console.log('Sending call offer to channel:', `calls:${calleeId}`);
      await callChannel.send({
        type: 'broadcast',
        event: 'call-offer',
        payload: {
          call_id: callData.id,
          offer: offer,
          from_user_id: user?.id,
          to_user_id: calleeId
        }
      });

      console.log('Call offer sent successfully');

    } catch (error) {
      console.error('Error starting call:', error);
    }
  }, [user?.id, initializeMedia, createPeerConnection]);

  // Answer call
  const answerCall = useCallback(async (callId: string, offer: RTCSessionDescriptionInit) => {
    try {
      // Update call status
      await (supabase as any)
        .from('calls')
        .update({ status: 'connected' })
        .eq('id', callId);

      // Initialize media and peer connection
      const stream = await initializeMedia();
      const pc = createPeerConnection();

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Set remote description and create answer
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer through realtime channel
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'call-answer',
          payload: {
            call_id: callId,
            answer: answer,
            from_user_id: user?.id
          }
        });
      }

      const activeCallData = {
        id: callId,
        caller_id: incomingCall!.caller_id,
        callee_id: user?.id || '',
        status: 'connected' as const,
        created_at: new Date().toISOString(),
        caller_profile: incomingCall?.caller_profile
      };
      
      setActiveCall(activeCallData);
      setIncomingCall(null);
      setIsCallActive(true);
      
      console.log('Call answered, setting active call:', activeCallData);

    } catch (error) {
      console.error('Error answering call:', error);
    }
  }, [user?.id, initializeMedia, createPeerConnection]);

  // Decline call
  const declineCall = useCallback(async (callId: string) => {
    try {
      await (supabase as any)
        .from('calls')
        .update({ status: 'declined' })
        .eq('id', callId);

      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'call-declined',
          payload: {
            call_id: callId,
            from_user_id: user?.id
          }
        });
      }

      setIncomingCall(null);
    } catch (error) {
      console.error('Error declining call:', error);
    }
  }, [user?.id]);

  // End call
  const endCall = useCallback(async () => {
    try {
      // Update call status in database
      if (outgoingCall) {
        await (supabase as any)
          .from('calls')
          .update({ status: 'ended' })
          .eq('id', outgoingCall.id);
      }

      // Send end call signal
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'call-ended',
          payload: {
            from_user_id: user?.id
          }
        });
      }

      // Clean up
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      setRemoteStream(null);
      setIsCallActive(false);
      setOutgoingCall(null);
      setIncomingCall(null);
      setActiveCall(null);
      setIsScreenSharing(false);

    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [user?.id, outgoingCall, localStream]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video visibility (camera stream stays active)
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        // Just toggle the enabled state to show/hide video
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        // Replace video track in peer connection
        if (peerConnectionRef.current && localStream) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );

          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        }

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        setIsScreenSharing(true);

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = async () => {
          // Switch back to camera
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });

          if (peerConnectionRef.current) {
            const videoTrack = cameraStream.getVideoTracks()[0];
            const sender = peerConnectionRef.current.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );

            if (sender) {
              await sender.replaceTrack(videoTrack);
            }
          }

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = cameraStream;
          }

          setLocalStream(cameraStream);
          setIsScreenSharing(false);
        };

      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (peerConnectionRef.current) {
          const videoTrack = cameraStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );

          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream;
        }

        setLocalStream(cameraStream);
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  }, [isScreenSharing, localStream]);

  // Set up realtime listeners
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up realtime listeners for user:', user.id);

    const channel = supabase.channel(`calls:${user.id}`)
      .on('broadcast', { event: 'call-offer' }, async (payload) => {
        console.log('Received call offer:', payload);
        const { call_id, offer, from_user_id, to_user_id } = payload.payload;
        
        if (to_user_id === user.id) {
          console.log('This call is for me, fetching caller profile...');
          // Fetch caller profile
          const { data: callerProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', from_user_id)
            .maybeSingle();

          console.log('Setting incoming call with profile:', callerProfile);
          setIncomingCall({
            id: call_id,
            caller_id: from_user_id,
            callee_id: to_user_id,
            status: 'ringing',
            created_at: new Date().toISOString(),
            offer: offer,
            caller_profile: callerProfile
          });
        }
      })
      .on('broadcast', { event: 'call-answer' }, async (payload) => {
        console.log('Received call answer:', payload);
        const { answer } = payload.payload;
        
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(answer);
          setIsCallActive(true);
          // Set active call for caller when answer is received
          if (outgoingCall) {
            setActiveCall(outgoingCall);
          }
          setOutgoingCall(null);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, async (payload) => {
        console.log('Received ice candidate:', payload);
        const { candidate } = payload.payload;
        
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      })
      .on('broadcast', { event: 'call-declined' }, () => {
        console.log('Call was declined');
        // Clean up all call states when declined
        setOutgoingCall(null);
        setActiveCall(null);
        setIsCallActive(false);
        setIncomingCall(null);
        
        // Clean up peer connection and streams
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
          setLocalStream(null);
        }
        
        setRemoteStream(null);
      })
      .on('broadcast', { event: 'call-ended' }, () => {
        console.log('Call was ended');
        endCall();
      })
      .subscribe();

    console.log('Subscribed to channel:', channel);
    channelRef.current = channel;

    return () => {
      console.log('Cleaning up realtime listeners');
      supabase.removeChannel(channel);
    };
  }, [user?.id, endCall]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    incomingCall,
    outgoingCall,
    activeCall,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare
  };
};