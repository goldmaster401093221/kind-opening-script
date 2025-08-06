import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useToast } from './use-toast';

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
  const { toast } = useToast();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<CallData | null>(null);
  const [activeCall, setActiveCall] = useState<CallData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | null>(null);
  
  // New features for complete meeting experience
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState<string[]>([]);
  const [callChat, setCallChat] = useState<Array<{id: string, sender: string, message: string, timestamp: string}>>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [callQuality, setCallQuality] = useState<'good' | 'poor' | 'excellent'>('good');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor video refs and streams
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log('🔄 Updating remote video with stream');
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => console.error('Error playing remote video:', e));
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log('🔄 Updating local video with stream');
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(e => console.error('Error playing local video:', e));
    }
  }, [localStream]);

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
      
      // Set initial video enabled state
      setIsVideoEnabled(video);
      
      // Set video element if available
      if (localVideoRef.current && video) {
        console.log('🎥 Setting local video srcObject');
        localVideoRef.current.srcObject = stream;
        // Ensure the video plays
        localVideoRef.current.play().catch(e => console.error('Error playing local video:', e));
      } else if (!localVideoRef.current) {
        console.warn('⚠️ localVideoRef.current is null');
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
      console.log('🎥 Remote track received:', event);
      const [remoteStream] = event.streams;
      console.log('📹 Remote stream:', remoteStream);
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        console.log('🔗 Setting remote video srcObject');
        remoteVideoRef.current.srcObject = remoteStream;
        // Ensure the video plays
        remoteVideoRef.current.play().catch(e => console.error('Error playing remote video:', e));
      } else {
        console.warn('⚠️ remoteVideoRef.current is null');
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsCallActive(true);
        setConnectionStatus('connected');
        console.log('✅ Call connected! Users can now speak and see each other.');
        toast({
          title: "Call Connected! 🎉",
          description: "You can now speak and see each other. The call is live!",
          duration: 3000,
        });
      } else if (pc.connectionState === 'connecting') {
        setConnectionStatus('connecting');
        console.log('🔄 Connecting call...');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('disconnected');
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
      setConnectionStatus('connecting');
      
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
      setConnectionStatus(null);
    }
  }, [user?.id, initializeMedia, createPeerConnection]);

  // Answer call
  const answerCall = useCallback(async (callId: string, offer: RTCSessionDescriptionInit) => {
    try {
      console.log('Answering call:', callId);
      
      // Safety check for incomingCall
      if (!incomingCall) {
        console.error('No incoming call to answer');
        return;
      }
      
      setConnectionStatus('connecting');
      
      // Update call status
      await (supabase as any)
        .from('calls')
        .update({ status: 'connected' })
        .eq('id', callId);

      console.log('Call status updated to connected');

      // Initialize media and peer connection
      const stream = await initializeMedia();
      const pc = createPeerConnection();

      console.log('Media initialized and peer connection created');

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Set remote description and create answer
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log('Answer created and set as local description');

      // Send answer through realtime channel to the caller
      const callerChannel = supabase.channel(`calls:${incomingCall.caller_id}`);
      await callerChannel.subscribe();
      
      console.log('Sending answer to caller:', incomingCall.caller_id);
      await callerChannel.send({
        type: 'broadcast',
        event: 'call-answer',
        payload: {
          call_id: callId,
          answer: answer,
          from_user_id: user?.id,
          to_user_id: incomingCall.caller_id
        }
      });

      const activeCallData = {
        id: callId,
        caller_id: incomingCall.caller_id,
        callee_id: user?.id || '',
        status: 'connected' as const,
        created_at: new Date().toISOString(),
        caller_profile: incomingCall?.caller_profile
      };
      
      console.log('About to set activeCall with data:', activeCallData);
      setActiveCall(activeCallData);
      setIncomingCall(null);
      setIsCallActive(true);
      
      console.log('Call answered successfully, setting active call:', activeCallData);
      console.log('State after answering call:', {
        activeCall: activeCallData,
        incomingCall: null,
        isCallActive: true
      });

    } catch (error) {
      console.error('Error answering call:', error);
      setConnectionStatus(null);
      // Clean up on error
      setIncomingCall(null);
    }
  }, [user?.id, initializeMedia, createPeerConnection, incomingCall]);

  // Decline call
  const declineCall = useCallback(async (callId: string) => {
    try {
      console.log('Declining call:', callId);
      
      // Safety check for incomingCall
      if (!incomingCall) {
        console.error('No incoming call to decline');
        return;
      }
      
      await (supabase as any)
        .from('calls')
        .update({ status: 'declined' })
        .eq('id', callId);

      console.log('Call status updated to declined');

      // Send decline signal to the caller
      const callerChannel = supabase.channel(`calls:${incomingCall.caller_id}`);
      await callerChannel.subscribe();
      
      console.log('Sending decline signal to caller');
      await callerChannel.send({
        type: 'broadcast',
        event: 'call-declined',
        payload: {
          call_id: callId,
          from_user_id: user?.id
        }
      });

      setIncomingCall(null);
      console.log('Call declined successfully');
    } catch (error) {
      console.error('Error declining call:', error);
      // Clean up on error
      setIncomingCall(null);
    }
  }, [user?.id, incomingCall]);

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
      console.log('Clearing activeCall in endCall function');
      setActiveCall(null);
      setIsScreenSharing(false);
      setConnectionStatus(null);

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
        // Toggle the enabled state to show/hide video
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        console.log('Video toggled:', videoTrack.enabled ? 'enabled' : 'disabled');
        
        // Update the video element display
        if (localVideoRef.current) {
          if (videoTrack.enabled) {
            // Show video by setting the stream
            localVideoRef.current.srcObject = localStream;
            console.log('Video element updated with stream');
          } else {
            // Hide video by clearing the stream
            localVideoRef.current.srcObject = null;
            console.log('Video element cleared');
          }
        } else {
          console.log('Local video ref not available');
        }
      } else {
        console.log('No video track found in local stream');
      }
    } else {
      console.log('No local stream available');
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

          if (localVideoRef.current && isVideoEnabled) {
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

        if (localVideoRef.current && isVideoEnabled) {
          localVideoRef.current.srcObject = cameraStream;
        }

        setLocalStream(cameraStream);
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  }, [isScreenSharing, localStream, isVideoEnabled]);

  // Start/Stop recording
  const toggleRecording = useCallback(async () => {
    try {
      if (!isRecording) {
        if (localStream) {
          const combinedStream = new MediaStream();
          localStream.getTracks().forEach(track => combinedStream.addTrack(track));
          if (remoteStream) {
            remoteStream.getTracks().forEach(track => combinedStream.addTrack(track));
          }

          const recorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm;codecs=vp9'
          });

          const chunks: Blob[] = [];
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };

          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `meeting-recording-${new Date().toISOString()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
          };

          recordingRef.current = recorder;
          recorder.start();
          setIsRecording(true);
          toast({
            title: "Recording Started",
            description: "Meeting is now being recorded",
            duration: 3000,
          });
        }
      } else {
        if (recordingRef.current) {
          recordingRef.current.stop();
          recordingRef.current = null;
          setIsRecording(false);
          toast({
            title: "Recording Stopped",
            description: "Recording has been saved to your device",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start/stop recording",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [isRecording, localStream, remoteStream, toast]);

  // Toggle hand raise
  const toggleHandRaise = useCallback(() => {
    setIsHandRaised(!isHandRaised);
    // Send hand raise signal to other participants
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'hand-raise',
        payload: {
          from_user_id: user?.id,
          is_raised: !isHandRaised
        }
      });
    }
  }, [isHandRaised, user?.id]);

  // Toggle background blur (simplified implementation)
  const toggleBackgroundBlur = useCallback(() => {
    setIsBackgroundBlurred(!isBackgroundBlurred);
    // Note: Real background blur would require more complex implementation
    // This is a placeholder for the feature
    toast({
      title: isBackgroundBlurred ? "Background Blur Disabled" : "Background Blur Enabled",
      description: isBackgroundBlurred ? "Background blur has been disabled" : "Background blur has been enabled",
      duration: 2000,
    });
  }, [isBackgroundBlurred, toast]);

  // Send message in call chat
  const sendCallMessage = useCallback((message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: user?.id || 'unknown',
      message,
      timestamp: new Date().toISOString()
    };
    setCallChat(prev => [...prev, newMessage]);

    // Send message to other participants
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'call-chat',
        payload: {
          from_user_id: user?.id,
          message,
          timestamp: newMessage.timestamp
        }
      });
    }
  }, [user?.id]);

  // Monitor call quality
  const monitorCallQuality = useCallback(() => {
    if (peerConnectionRef.current) {
      const stats = peerConnectionRef.current.getStats();
      stats.then((results) => {
        results.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            const packetsLost = report.packetsLost || 0;
            const packetsReceived = report.packetsReceived || 0;
            const lossRate = packetsLost / (packetsLost + packetsReceived);
            
            if (lossRate < 0.01) {
              setCallQuality('excellent');
            } else if (lossRate < 0.05) {
              setCallQuality('good');
            } else {
              setCallQuality('poor');
            }
          }
        });
      });
    }
  }, []);

  // Start call timer
  const startCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  // Stop call timer
  const stopCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallDuration(0);
  }, []);

  // Handle local video element updates
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      if (isVideoEnabled) {
        localVideoRef.current.srcObject = localStream;
      } else {
        localVideoRef.current.srcObject = null;
      }
    }
  }, [localStream, isVideoEnabled]);

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
        const { answer, from_user_id, to_user_id } = payload.payload;
        
        // Only process if this answer is for us (the caller)
        if (to_user_id === user?.id && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(answer);
            setIsCallActive(true);
            // Set active call for caller when answer is received
            if (outgoingCall) {
              console.log('Setting activeCall for caller with outgoingCall:', outgoingCall);
              setActiveCall(outgoingCall);
            }
            setOutgoingCall(null);
            console.log('Call connection established successfully');
          } catch (error) {
            console.error('Error setting remote description:', error);
          }
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, async (payload) => {
        console.log('Received ice candidate:', payload);
        const { candidate } = payload.payload;
        
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      })
      .on('broadcast', { event: 'call-declined' }, (payload) => {
        console.log('Call was declined:', payload);
        const { call_id, from_user_id } = payload.payload;
        
        // Only process if this decline is for our outgoing call
        if (outgoingCall && outgoingCall.id === call_id) {
          console.log('Our outgoing call was declined');
          toast({
            title: "Call Declined",
            description: "The person you called declined the call.",
            variant: "destructive",
            duration: 3000,
          });
          // Clean up all call states when declined
          setOutgoingCall(null);
          console.log('Clearing activeCall in call-declined handler');
          setActiveCall(null);
          setIsCallActive(false);
          setIncomingCall(null);
          setConnectionStatus(null);
          
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
        }
      })
      .on('broadcast', { event: 'call-ended' }, () => {
        console.log('Call was ended');
        endCall();
      })
      .on('broadcast', { event: 'hand-raise' }, (payload) => {
        console.log('Hand raise event:', payload);
        const { from_user_id, is_raised } = payload.payload;
        // Handle hand raise from other participants
        if (from_user_id !== user?.id) {
          toast({
            title: is_raised ? "Hand Raised" : "Hand Lowered",
            description: `A participant ${is_raised ? 'raised' : 'lowered'} their hand`,
            duration: 3000,
          });
        }
      })
      .on('broadcast', { event: 'call-chat' }, (payload) => {
        console.log('Call chat message:', payload);
        const { from_user_id, message, timestamp } = payload.payload;
        if (from_user_id !== user?.id) {
          const newMessage = {
            id: Date.now().toString(),
            sender: from_user_id,
            message,
            timestamp
          };
          setCallChat(prev => [...prev, newMessage]);
        }
      })
      .subscribe();

    console.log('Subscribed to channel:', channel);
    channelRef.current = channel;

    return () => {
      console.log('Cleaning up realtime listeners');
      supabase.removeChannel(channel);
    };
  }, [user?.id, endCall, outgoingCall, localStream]);

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
    connectionStatus,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleRecording,
    toggleHandRaise,
    toggleBackgroundBlur,
    sendCallMessage,
    monitorCallQuality,
    startCallTimer,
    stopCallTimer,
    callDuration,
    callChat,
    isHandRaised,
    isBackgroundBlurred,
    callQuality,
    isRecording,
    participants
  };
};