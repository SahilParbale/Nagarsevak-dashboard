import { supabase } from './supabaseClient';

export const getUpdates = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_updates')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching updates:', err);
    return [];
  }
};

export const createUpdate = async (updateData) => {
  try {
    const { data, error } = await supabase
      .from('admin_updates')
      .insert([updateData])
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error creating update:', err);
    return { success: false, error: err };
  }
};

export const subscribeToUpdates = (callback) => {
  const channelName = `public:admin_updates:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_updates' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};

export const updateRequestStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('admin_updates')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error updating request status:', err);
    return { success: false, error: err };
  }
};
