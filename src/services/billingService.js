import { supabase } from './supabaseClient';

export const getBillingRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_billing')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching billing records:', err);
    return [];
  }
};

export const subscribeToBillingRecords = (callback) => {
  const channelName = `public:admin_billing:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_billing' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};
