import { supabase } from './supabaseClient';

export const getLoginLogs = async () => {
  try {
    const { data, error } = await supabase
      .from('login_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching login logs:', err);
    return [];
  }
};

export const subscribeToLoginLogs = (callback) => {
  const channelName = `public:login_logs:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'login_logs' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};
