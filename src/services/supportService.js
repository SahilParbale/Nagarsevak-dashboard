import { supabase } from './supabaseClient';

const formatTime = (dateString) => {
  if (!dateString) return 'Unknown time';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getSupportTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
    
    return (data || []).map(ticket => ({
      ...ticket,
      issue: ticket.title || 'Untitled Issue',
      customer: ticket.user_name || ticket.user_id || 'Unknown Customer',
      time: formatTime(ticket.created_at),
      timeOpen: formatTime(ticket.created_at),
    }));
  } catch (err) {
    console.error('Error fetching tickets:', err);
    return [];
  }
};

export const subscribeToSupportTickets = (callback) => {
  const channelName = `public:support_tickets:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, (payload) => {
      if (payload.new) {
        payload.new = {
          ...payload.new,
          issue: payload.new.title || 'Untitled Issue',
          customer: payload.new.user_name || payload.new.user_id || 'Unknown Customer',
          time: formatTime(payload.new.created_at),
          timeOpen: formatTime(payload.new.created_at),
        };
      }
      callback(payload);
    })
    .subscribe();
};

export const updateSupportTicketStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error updating ticket status:', err);
    return { success: false, error: err };
  }
};
