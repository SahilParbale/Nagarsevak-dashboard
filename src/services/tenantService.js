import { supabase, supabaseAdmin } from './supabaseClient';

export const getTenants = async () => {
  try {
    // Attempt to fetch tenants from the actual database
    const { data, error } = await supabase
      .from('tenants')
      .select('*');
      
    if (error) {
      console.error('Error fetching tenants:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error fetching tenants:', err);
    return [];
  }
};

export const createTenant = async (tenantData, credentials = null) => {
  try {
    // 1. Create the tenant record using Admin client to bypass RLS
    const client = supabaseAdmin || supabase;
    
    // Extract 'version' and 'id' since they should not be explicitly inserted
    const { version, id, ...dbInsertData } = tenantData;
    
    const { data: tenantResults, error: tenantError } = await client
      .from('tenants')
      .insert([dbInsertData])
      .select();
      
    if (tenantError) throw tenantError;
    const newTenantRecord = tenantResults[0];

    // 2. If credentials provided, create user and map
    if (credentials && credentials.loginEmail && credentials.password) {
      if (!supabaseAdmin) {
        throw new Error('Supabase Service Role Key is missing. Cannot create login credentials safely.');
      }

      // Create user in Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: credentials.loginEmail,
        password: credentials.password,
        email_confirm: true,
        user_metadata: {
          name: newTenantRecord.name,
          plan: newTenantRecord.plan,
          version: tenantData.version || 'Basic',
          loginEmail: credentials.loginEmail,
          loginPassword: credentials.password
        }
      });

      if (authError) throw authError;

      const authUser = authData.user;

      // Create user_tenant_mapping using Admin client to bypass RLS
      const { error: mappingError } = await supabaseAdmin
        .from('user_tenant_mapping')
        .insert([{
          user_id: authUser.id,
          tenant_id: newTenantRecord.id,
          role: newTenantRecord.plan.toLowerCase() // Assign role based on plan (amdar, nagarsevak, etc)
        }]);

      if (mappingError) {
        console.error('Failed to map user to tenant:', mappingError);
        // We continue because tenant and auth are created, but we should log it
      }
    }

    return { success: true, data: tenantResults };
  } catch (err) {
    console.error('Error creating tenant:', err);
    return { success: false, error: err };
  }
};

export const getTenantCredentials = async (tenantId) => {
  try {
    if (!supabaseAdmin) throw new Error('Supabase Service Role Key is missing.');
    
    // 1. Find the user ID mapped to this tenant
    const { data: mappingData, error: mappingError } = await supabaseAdmin
      .from('user_tenant_mapping')
      .select('user_id')
      .eq('tenant_id', tenantId)
      .single();
      
    if (mappingError || !mappingData) return null;
    
    // 2. Fetch the full auth user to read the metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(mappingData.user_id);
    
    if (authError || !authData.user) return null;
    
    return {
      loginEmail: authData.user.user_metadata?.loginEmail || authData.user.email,
      loginPassword: authData.user.user_metadata?.loginPassword || 'Password hidden or not stored'
    };
  } catch (err) {
    console.error('Error fetching credentials:', err);
    return null;
  }
};

export const updateTenant = async (tenantId, tenantData) => {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('tenants')
      .update(tenantData)
      .eq('id', tenantId)
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error updating tenant:', err);
    return { success: false, error: err };
  }
};

export const updateTenantPassword = async (tenantId, newPassword) => {
  try {
    if (!supabaseAdmin) throw new Error('Supabase Service Role Key is missing. Cannot securely update password.');

    // 1. Get the user_id from the mapping table
    const { data: mappingData, error: mappingError } = await supabaseAdmin
      .from('user_tenant_mapping')
      .select('user_id')
      .eq('tenant_id', tenantId)
      .single();

    if (mappingError) throw mappingError;
    if (!mappingData) throw new Error('No login user found for this workspace.');

    // 2. Update the password using the Admin Auth API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      mappingData.user_id,
      { password: newPassword }
    );

    if (updateError) throw updateError;
    return { success: true };
  } catch (err) {
    console.error('Error updating password:', err);
    return { success: false, error: err };
  }
};

export const subscribeToTenants = (callback) => {
  const channelName = `public:tenants:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tenants' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};
