import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Users, 
  Bookmark, 
  MessageSquare, 
  Database, 
  Ship, 
  FileText, 
  Wrench, 
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  File,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';

const Collaboration = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('In Progress');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showEndCollaborationModal, setShowEndCollaborationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [endingCollabId, setEndingCollabId] = useState<string | null>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleEndCollaboration = async () => {
    try {
      if (!endingCollabId || !user) {
        setShowEndCollaborationModal(false);
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from('collaborations')
        .update({
          status: 'ended',
          end_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('id', endingCollabId);

      if (error) {
        console.error('End collaboration error', error);
        toast({ title: 'Failed to end collaboration', description: error.message, variant: 'destructive' });
        return;
      }

      setShowEndCollaborationModal(false);
      setShowFeedbackModal(true);

      // Refresh lists so UI reflects the changes immediately
      fetchInProgress();
      fetchHistory();
      fetchTodayActivities();
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Failed to end collaboration', description: e?.message || 'Unknown error', variant: 'destructive' });
    }
  };

  const handleFeedbackSubmit = async (feedback: {
    skillsRating: number;
    communicationRating: number;
    platformFeedback: string;
  }) => {
    try {
      if (!endingCollabId || !user) {
        setShowFeedbackModal(false);
        setEndingCollabId(null);
        return;
      }

      // Get the collaboration to find the other participant
      const { data: collaboration } = await supabase
        .from('collaborations')
        .select('*')
        .eq('id', endingCollabId)
        .single();

      if (collaboration) {
        const otherId = collaboration.requester_id === user.id 
          ? collaboration.collaborator_id 
          : collaboration.requester_id;

        // Calculate average rating from skills and communication
        const averageRating = (feedback.skillsRating + feedback.communicationRating) / 2;

        // Get current rating of the other user
        const { data: otherProfile } = await supabase
          .from('profiles')
          .select('rating, collaboration_count')
          .eq('id', otherId)
          .single();

        if (otherProfile) {
          const currentRating = otherProfile.rating || 0;
          const currentCount = otherProfile.collaboration_count || 0;
          const newCount = currentCount + 1;
          
          // Calculate new weighted average rating
          const newRating = ((currentRating * currentCount) + averageRating) / newCount;

          // Update the other user's profile with new rating
          await supabase
            .from('profiles')
            .update({
              rating: newRating,
              collaboration_count: newCount,
              updated_at: new Date().toISOString()
            })
            .eq('id', otherId);
        }
      }

      setShowFeedbackModal(false);
      setEndingCollabId(null);
      toast({
        title: "Collaboration Ended",
        description: "Thank you for your feedback. The collaboration has been ended successfully.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Feedback Error",
        description: "Failed to submit feedback, but collaboration was ended.",
        variant: "destructive"
      });
      setShowFeedbackModal(false);
      setEndingCollabId(null);
    }
  };

  // Incoming collaboration requests for the current user
  const [requests, setRequests] = useState<any[]>([]);
  const [requesterProfiles, setRequesterProfiles] = useState<Record<string, any>>({});
  const [loadingRequests, setLoadingRequests] = useState(false);

  // In-progress and history collaborations
  const [inProgress, setInProgress] = useState<any[]>([]);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [inProgressProfiles, setInProgressProfiles] = useState<Record<string, any>>({});
  const [historyProfiles, setHistoryProfiles] = useState<Record<string, any>>({});
  const [loadingInProgress, setLoadingInProgress] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Upcoming collaborations
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [upcomingProfiles, setUpcomingProfiles] = useState<Record<string, any>>({});
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  // Today activities per collaboration
  const [todayActivities, setTodayActivities] = useState<Record<string, { user: string; action: string; link: string }[]>>({});
  const [loadingActivities, setLoadingActivities] = useState(false);

  const fetchRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .eq('collaborator_id', user.id)
      .eq('status', 'contacted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests', error);
      setLoadingRequests(false);
      return;
    }

    const list = (data || []) as any[];
    setRequests(list);
    const requesterIds = Array.from(new Set(list.map((r: any) => r.requester_id)));
    if (requesterIds.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', requesterIds);
      const map: Record<string, any> = {};
      (profiles || []).forEach((p: any) => { map[p.id] = p; });
      setRequesterProfiles(map);
    } else {
      setRequesterProfiles({});
    }
    setLoadingRequests(false);
  };

  const fetchInProgress = async () => {
    if (!user) return;
    setLoadingInProgress(true);
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .or(`requester_id.eq.${user.id},collaborator_id.eq.${user.id}`)
      .eq('status', 'collaborated')
      .lte('start_date', today)
      .gte('end_date', today)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching in-progress collaborations', error);
      setLoadingInProgress(false);
      return;
    }
    const rows = (data || []) as any[];
    setInProgress(rows);
    const otherIds = Array.from(new Set(rows.map((r:any) => r.requester_id === user.id ? r.collaborator_id : r.requester_id)));
    if (otherIds.length) {
      const { data: profs } = await supabase.from('profiles').select('*').in('id', otherIds);
      const map: Record<string, any> = {};
      (profs || []).forEach((p:any)=>{ map[p.id]=p; });
      setInProgressProfiles(map);
    } else {
      setInProgressProfiles({});
    }
    setLoadingInProgress(false);
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    const today = new Date().toISOString().slice(0, 10);

    const [pastRes, completedRes] = await Promise.all([
      supabase
        .from('collaborations')
        .select('*')
        .or(`requester_id.eq.${user.id},collaborator_id.eq.${user.id}`)
        .eq('status', 'collaborated')
        .lt('end_date', today)
        .order('created_at', { ascending: false }),
      supabase
        .from('collaborations')
        .select('*')
        .or(`requester_id.eq.${user.id},collaborator_id.eq.${user.id}`)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
    ]);

    if (pastRes.error || completedRes.error) {
      console.error('Error fetching history', pastRes.error || completedRes.error);
      setLoadingHistory(false);
      return;
    }

    const rows = ([...(pastRes.data || []), ...(completedRes.data || [])] as any[])
      .reduce((acc: any[], curr: any) => (acc.some((r:any) => r.id === curr.id) ? acc : acc.concat(curr)), []);

    setHistoryItems(rows);

    const otherIds = Array.from(new Set(rows.map((r:any) => r.requester_id === user.id ? r.collaborator_id : r.requester_id))) as string[];
    if (otherIds.length) {
      const { data: profs } = await supabase.from('profiles').select('*').in('id', otherIds);
      const map: Record<string, any> = {};
      (profs || []).forEach((p:any)=>{ map[p.id]=p; });
      setHistoryProfiles(map);
    } else {
      setHistoryProfiles({});
    }
    setLoadingHistory(false);
  };

  const fetchUpcoming = async () => {
    if (!user) return;
    setLoadingUpcoming(true);
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .or(`requester_id.eq.${user.id},collaborator_id.eq.${user.id}`)
      .eq('status', 'collaborated')
      .gt('start_date', today)
      .order('start_date', { ascending: true });
    if (error) {
      console.error('Error fetching upcoming collaborations', error);
      setLoadingUpcoming(false);
      return;
    }
    const rows = (data || []) as any[];
    setUpcoming(rows);
    const otherIds = Array.from(new Set(rows.map((r:any) => r.requester_id === user.id ? r.collaborator_id : r.requester_id)));
    if (otherIds.length) {
      const { data: profs } = await supabase.from('profiles').select('*').in('id', otherIds);
      const map: Record<string, any> = {};
      (profs || []).forEach((p:any)=>{ map[p.id]=p; });
      setUpcomingProfiles(map);
    } else {
      setUpcomingProfiles({});
    }
    setLoadingUpcoming(false);
  };

  const handleAccept = async (req: any) => {
    const { error } = await supabase
      .from('collaborations')
      .update({ status: 'collaborated' })
      .eq('id', req.id);
    if (error) {
      console.error('Accept error', error);
      toast({ title: 'Failed to accept', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Request accepted' });
    fetchRequests();
    fetchInProgress();
  };

  // Build today's activity feed per collaboration
  const fetchTodayActivities = async () => {
    if (!user || inProgress.length === 0) return;
    setLoadingActivities(true);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const participantIds = new Set<string>();
    inProgress.forEach((c: any) => {
      participantIds.add(user.id);
      participantIds.add(c.requester_id === user.id ? c.collaborator_id : c.requester_id);
    });
    const ids = Array.from(participantIds);

    const [filesRes, commentsRes] = await Promise.all([
      supabase
        .from('data_center_files')
        .select('id,uploader_id,created_at')
        .in('uploader_id', ids)
        .gte('created_at', startISO)
        .lt('created_at', endISO),
      supabase
        .from('data_center_comments')
        .select('id,user_id,created_at')
        .in('user_id', ids)
        .gte('created_at', startISO)
        .lt('created_at', endISO),
    ]);

    const files = (filesRes.data || []) as any[];
    const comments = (commentsRes.data || []) as any[];

    const filesByUser: Record<string, number> = {};
    files.forEach((f: any) => {
      filesByUser[f.uploader_id] = (filesByUser[f.uploader_id] || 0) + 1;
    });

    const commentsByUser: Record<string, number> = {};
    comments.forEach((cm: any) => {
      commentsByUser[cm.user_id] = (commentsByUser[cm.user_id] || 0) + 1;
    });

    const isToday = (ts?: string) => {
      if (!ts) return false;
      const d = new Date(ts);
      return d >= start && d <= end;
    };

    const nameFor = (uid: string) => {
      if (uid === user.id) return getDisplayName();
      const p = inProgressProfiles[uid];
      if (!p) return 'Collaborator';
      const full = `${p.first_name || ''} ${p.last_name || ''}`.trim();
      return full || p.email || 'Collaborator';
    };

    const map: Record<string, { user: string; action: string; link: string }[]> = {};

    inProgress.forEach((c: any) => {
      const otherId = c.requester_id === user.id ? c.collaborator_id : c.requester_id;
      const items: { user: string; action: string; link: string }[] = [];

      // Request received today (if you're the collaborator)
      if (user.id === c.collaborator_id && isToday(c.created_at)) {
        items.push({
          user: nameFor(otherId),
          action: 'sent you a collaboration request',
          link: 'View'
        });
      }

      // Collaboration ends today (by date)
      if (c.end_date && c.end_date === new Date().toISOString().slice(0, 10)) {
        items.push({ user: 'System', action: 'Collaboration ends today', link: 'View' });
      }

      // Collaboration status updated to ended/declined/completed today
      if (isToday(c.updated_at) && ['ended', 'declined', 'completed'].includes(c.status)) {
        items.push({ user: 'System', action: 'Collaboration updated today', link: 'View' });
      }

      // Files uploaded today by participants
      const otherFiles = filesByUser[otherId] || 0;
      const myFiles = filesByUser[user.id] || 0;
      if (otherFiles > 0) {
        items.push({
          user: nameFor(otherId),
          action: `attached ${otherFiles} file${otherFiles > 1 ? 's' : ''}`,
          link: 'View'
        });
      }
      if (myFiles > 0) {
        items.push({
          user: 'You',
          action: `attached ${myFiles} file${myFiles > 1 ? 's' : ''}`,
          link: 'View'
        });
      }

      // Comments left today by participants
      const otherComments = commentsByUser[otherId] || 0;
      const myComments = commentsByUser[user.id] || 0;
      if (otherComments > 0) {
        items.push({
          user: nameFor(otherId),
          action: `has left ${otherComments} comment${otherComments > 1 ? 's' : ''}`,
          link: 'View'
        });
      }
      if (myComments > 0) {
        items.push({
          user: 'You',
          action: `have left ${myComments} comment${myComments > 1 ? 's' : ''}`,
          link: 'View'
        });
      }

      map[c.id] = items;
    });

    setTodayActivities(map);
    setLoadingActivities(false);
  };

  const handleReject = async (req: any) => {
    const { error } = await supabase
      .from('collaborations')
      .update({ status: 'declined' })
      .eq('id', req.id);
    if (error) {
      console.error('Reject error', error);
      toast({ title: 'Failed to reject', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Request rejected' });
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
    fetchInProgress();
    fetchHistory();
    fetchUpcoming();
  }, [user]);

  useEffect(() => {
    // refresh activities whenever collaborations or participant profiles change
    fetchTodayActivities();
  }, [inProgress, inProgressProfiles, user]);

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
    { icon: Bookmark, label: 'Saved Collaborators', active: false },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Database, label: 'Data Center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: false },
  ];

  const activities = [
    {
      user: 'Bashair Mussa',
      action: 'attached 1 file',
      link: 'View'
    },
    {
      user: 'Anna Krylova',
      action: 'attached 2 files',
      link: 'View'
    },
    {
      user: 'Kevin Rashy',
      action: 'has left 3 comments',
      link: 'View'
    },
    {
      user: 'Anna Krylova',
      action: 'attached 2 files',
      link: 'View'
    },
    {
      user: 'Kevin Rashy',
      action: 'has left 3 comments',
      link: 'View'
    }
  ];

  const supportingServicesData = [
    {
      name: '1 Shipment ( In progress )',
      link: 'View',
      icon: Ship
    },
    {
      name: '1 Quotation ( Completed )',
      link: 'View',
      icon: FileText
    },
    {
      name: '1 Experiment ( In progress )',
      link: 'View',
      icon: Wrench
    },
    {
      name: '1 Identify ( Completed )',
      link: 'View',
      icon: Database
    }
  ];

  const renderTabContent = () => {
    if (activeTab === 'Upcoming') {
      return (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            {loadingUpcoming ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">Loading upcoming collaborations...</div>
                </CardContent>
              </Card>
            ) : upcoming.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">No upcoming collaborations.</div>
                </CardContent>
              </Card>
            ) : (
              upcoming.map((c: any) => {
                const otherParticipantId = c.requester_id === user?.id ? c.collaborator_id : c.requester_id;
                const otherParticipant = upcomingProfiles[otherParticipantId];
                const isRequester = c.requester_id === user?.id;
                
                return (
                  <Card key={c.id} className="mb-4">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Collaboration Status</h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                            Upcoming
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                          <span>From {c.start_date || '-'}</span>
                          <span>To {c.end_date || '-'}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium mb-4">Collaborators</h4>
                        
                        <div className="space-y-4">
                          {/* Current user */}
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-12 h-12">
                              {profile?.avatar_url ? (
                                <AvatarImage src={profile.avatar_url} alt={getDisplayName()} />
                              ) : (
                                <AvatarFallback className="bg-gray-800 text-white text-sm">
                                  {getInitials()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{getDisplayName()} (me)</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(profile as any)?.research_roles && typeof (profile as any).research_roles === 'string' ? 
                                  (profile as any).research_roles.split(',').map((role: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">{role.trim()}</Badge>
                                  )) : 
                                  <Badge variant="outline" className="text-xs">Researcher</Badge>
                                }
                              </div>
                              <div className="flex space-x-2 mt-2">
                                {(profile as any)?.specialization_keywords && typeof (profile as any).specialization_keywords === 'string' ? 
                                  (profile as any).specialization_keywords.split(',').slice(0, 3).map((keyword: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">{keyword.trim()}</Badge>
                                  )) : 
                                  ((profile as any)?.research_roles && typeof (profile as any).research_roles === 'string' ? 
                                    (profile as any).research_roles.split(',').map((role: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs">{role.trim()}</Badge>
                                    )) : null
                                  )
                                }
                              </div>
                            </div>
                            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" onClick={() => navigate(`/chat?with=${otherParticipantId}`)}>
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Other participant */}
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-12 h-12">
                              {otherParticipant?.avatar_url ? (
                                <AvatarImage src={otherParticipant.avatar_url} alt={`${otherParticipant?.first_name || ''} ${otherParticipant?.last_name || ''}`.trim()} />
                              ) : (
                                <AvatarFallback className="bg-gray-800 text-white text-sm">
                                  {(otherParticipant?.first_name?.[0] || 'U') + (otherParticipant?.last_name?.[0] || '')}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">
                                {otherParticipant ? `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim() || otherParticipant.email : 'Unknown user'}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {otherParticipant?.research_roles && typeof otherParticipant.research_roles === 'string' ? 
                                  otherParticipant.research_roles.split(',').map((role: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">{role.trim()}</Badge>
                                  )) : 
                                  <Badge variant="outline" className="text-xs">Researcher</Badge>
                                }
                              </div>
                              <div className="flex space-x-2 mt-2">
                                {otherParticipant?.specialization_keywords && typeof otherParticipant.specialization_keywords === 'string' ? 
                                  otherParticipant.specialization_keywords.split(',').slice(0, 3).map((keyword: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">{keyword.trim()}</Badge>
                                  )) : 
                                  (otherParticipant?.research_roles && typeof otherParticipant.research_roles === 'string' ? 
                                    otherParticipant.research_roles.split(',').map((role: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs">{role.trim()}</Badge>
                                    )) : null
                                  )
                                }
                              </div>
                            </div>
                            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" onClick={() => navigate(`/chat?with=${otherParticipantId}`)}>
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full mt-4" onClick={()=>{navigate('/discover-collaborators');}}>
                          Invite More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'Requests') {
      return (
        <div className="grid grid-cols-6 gap-4">
          {/* Main Collaboration Content */}
          <div className="col-span-4">
            {loadingRequests ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">Loading requests...</div>
                </CardContent>
              </Card>
            ) : requests.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">No incoming requests.</div>
                </CardContent>
              </Card>
            ) : (
              requests.map((req: any) => {
                const requester = requesterProfiles[req.requester_id];
                return (
                  <Card key={req.id} className="mb-4">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Collaboration Status</h3>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                            Incoming Request
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                          <span>From {req.start_date || '-'}</span>
                          <span>To {req.end_date || '-'}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium mb-4">Collaborator</h4>
                        <div className="flex items-start space-x-3 mb-6">
                          <Avatar className="w-12 h-12">
                            {requester?.avatar_url ? (
                              <AvatarImage src={requester.avatar_url} alt={requester?.first_name || 'Collaborator'} />
                            ) : (
                              <AvatarFallback className="bg-gray-800 text-white text-sm">
                                {(requester?.first_name?.[0] || 'U') + (requester?.last_name?.[0] || '')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{requester ? `${requester.first_name || ''} ${requester.last_name || ''}`.trim() || requester.email : 'Unknown user'}</div>
                            <div className="text-sm text-gray-500">Researcher Role</div>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">Equipment</Badge>
                              <Badge variant="outline" className="text-xs">Experiment</Badge>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium mb-4">Terms of Collaboration</h4>
                          <div className="space-y-3">
                            {(req.terms || ['Term of collaboration']).map((t: string, i: number) => (
                              <div key={i} className="flex items-center space-x-2">
                                <Checkbox id={`term-${req.id}-${i}`} defaultChecked disabled />
                                <label htmlFor={`term-${req.id}-${i}`} className="text-sm">{t}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                          <div className="flex space-x-4">
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAccept(req)}>
                              Accept Request
                            </Button>
                            <Button variant="outline" className="text-blue-600 border-blue-600" onClick={() => handleReject(req)}>
                              Reject Request
                            </Button>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'In Progress') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Left: Status, Calendar, Activity, Actions */}
          <div className="md:col-span-4 space-y-6">
            {loadingInProgress ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">Loading...</div>
                </CardContent>
              </Card>
            ) : inProgress.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">No active collaborations.</div>
                </CardContent>
              </Card>
            ) : (
              inProgress.map((c: any) => {
                const otherId = c.requester_id === user?.id ? c.collaborator_id : c.requester_id;
                const other = inProgressProfiles[otherId];
                const todayLabel = `${format(new Date(), 'MMM do')}`;
                return (
                  <div key={c.id} className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Collaboration Status</h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">In Progress</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                          <span>From {c.start_date || '-'}</span>
                          <span>To {c.end_date || '-'}</span>
                        </div>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">{todayLabel} (Today) Activity</h4>
                        <div className="space-y-3">
                          {loadingActivities ? (
                            <div className="text-sm text-gray-500">Loading today's activity...</div>
                          ) : todayActivities[c.id] && todayActivities[c.id].length > 0 ? (
                            todayActivities[c.id].map((activity, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                  <File className="w-4 h-4" />
                                </div>
                                <div className="flex-1 text-sm">
                                  <span className="font-medium">{activity.user}</span> {activity.action}
                                  <button className="ml-2 text-blue-600 hover:underline invisible">{activity.link}</button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No activity yet today.</div>
                          )}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Button variant="outline" className="text-blue-600 border-blue-600" onClick={() => navigate('/data-center')}>
                            Go to Data Center
                          </Button>
                          <Button variant="outline" className="text-blue-600 border-blue-600" onClick={() => navigate(`/chat?with=${otherId}`)}>
                            Go to Chat Room
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Collaborators + Supporting Services */}
          <aside className="md:col-span-2 space-y-6">
            {inProgress.map((c: any) => {
              const otherId = c.requester_id === user?.id ? c.collaborator_id : c.requester_id;
              const other = inProgressProfiles[otherId];
              return (
                <div key={`aside-${c.id}`} className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">{other ? '2 Collaborators' : 'Collaborators'}</h4>
                      <div className="space-y-4">
                        {/* Current user */}
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            {profile?.avatar_url ? (
                              <AvatarImage src={profile.avatar_url} alt={getDisplayName()} />
                            ) : (
                              <AvatarFallback className="bg-gray-800 text-white text-xs">{getInitials()}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{getDisplayName()} (me)</div>
                            <div className="text-xs text-gray-500">Researcher Role</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">Idea</Badge>
                              <Badge variant="outline" className="text-xs">Proposal</Badge>
                              <Badge variant="outline" className="text-xs">Grant Application</Badge>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" onClick={() => navigate(`/chat?with=${otherId}`)}>
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Other participant */}
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            {other?.avatar_url ? (
                              <AvatarImage src={other.avatar_url} alt={`${other?.first_name || ''} ${other?.last_name || ''}`.trim()} />
                            ) : (
                              <AvatarFallback className="bg-gray-800 text-white text-xs">{(other?.first_name?.[0] || 'U') + (other?.last_name?.[0] || '')}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{other ? `${other.first_name || ''} ${other.last_name || ''}`.trim() || other.email : 'Unknown user'}</div>
                            <div className="text-xs text-gray-500">Researcher Role</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">Equipment</Badge>
                              <Badge variant="outline" className="text-xs">Experiment</Badge>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" onClick={() => navigate(`/chat?with=${otherId}`)}>
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-6" onClick={() => { setEndingCollabId(c.id); setShowEndCollaborationModal(true); }}>
                        End Collaboration
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Supporting Services</h4>
                      <div className="space-y-4">
                        {supportingServicesData.map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                <s.icon className="w-4 h-4" />
                              </div>
                              <div className="text-sm">{s.name}</div>
                            </div>
                            <button className="text-blue-600 hover:underline text-sm invisible">{s.link}</button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </aside>
        </div>
      );
    }

    if (activeTab === 'History') {
      return (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            {loadingHistory ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">Loading...</div>
                </CardContent>
              </Card>
            ) : historyItems.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500">No completed collaborations.</div>
                </CardContent>
              </Card>
            ) : (
              historyItems.map((c: any) => {
                const otherId = c.requester_id === user?.id ? c.collaborator_id : c.requester_id;
                const other = historyProfiles[otherId];
                return (
                  <Card key={c.id} className="mb-4">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Collaboration</h3>
                           <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">
                             Completed
                           </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                          <span>From {c.start_date || '-'}</span>
                          <span>To {c.end_date || '-'}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mb-6">
                        <Avatar className="w-12 h-12">
                          {other?.avatar_url ? (
                            <AvatarImage src={other.avatar_url} alt={other?.first_name || 'Collaborator'} />
                          ) : (
                            <AvatarFallback className="bg-gray-800 text-white text-sm">
                              {(other?.first_name?.[0] || 'U') + (other?.last_name?.[0] || '')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {other ? `${other.first_name || ''} ${other.last_name || ''}`.trim() || other.email : 'Unknown user'}
                          </div>
                          <div className="text-sm text-gray-500">Researcher Role</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AIRCollab</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-6">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Home
            </div>
            {home.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.label === 'Dashboard') {
                    navigate('/dashboard');
                  } else if (item.label === 'Discover Collaborators') {
                    navigate('/discover-collaborators');
                  } else if (item.label === 'Saved Collaborators') {
                    navigate('/saved-collaborators');
                  } else if (item.label === 'Home') {
                    navigate('/');
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Collaborations
            </div>
            {collaborationItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.label === 'Collaboration') {
                    navigate('/collaboration');
                  } else if (item.label === 'Chat') {
                    navigate('/chat');
                  } else if (item.label === 'Data Center') {
                    navigate('/data-center');
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Supporting Services
            </div>
            {supportingServices.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.label === 'Shipment') {
                    navigate('/shipment');
                  } else if (item.label === 'Quotation') {
                    navigate('/quotation');
                  } else if (item.label === 'Equipment') {
                    navigate('/equipment');
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile avatar" />
              ) : (
                <AvatarFallback className="bg-gray-800 text-white text-sm">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {getDisplayName()}
              </div>
              <div className="text-xs text-gray-500">{profile?.email}</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Collaboration</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-8 border-b border-gray-200">
              {['In Progress', 'Upcoming', 'Requests', 'History'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === tab
                      ? 'bg-white border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>

      {/* End Collaboration Modal */}
      <Dialog open={showEndCollaborationModal} onOpenChange={setShowEndCollaborationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">End Collaboration</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-600 mt-4">
            Your collaboration has 2 days remaining, are you still going to end this collaboration?
          </DialogDescription>
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEndCollaborationModal(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEndCollaboration}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Yes, End Collaboration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedbackModal}
        onOpenChange={setShowFeedbackModal}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Collaboration;
