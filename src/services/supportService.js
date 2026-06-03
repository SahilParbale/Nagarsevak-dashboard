import { supabase } from './supabaseClient';

export const getSupportTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error fetching tickets:', err);
    return [];
  }
};

export const subscribeToSupportTickets = (callback) => {
  const channelName = `public:admin_support_tickets:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_support_tickets' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};
