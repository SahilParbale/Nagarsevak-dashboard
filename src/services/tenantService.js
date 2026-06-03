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
    const { data: tenantResults, error: tenantError } = await client
      .from('tenants')
      .insert([tenantData])
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
          name: newTenantRecord.name
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

export const subscribeToTenants = (callback) => {
  const channelName = `public:tenants:${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tenants' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};
