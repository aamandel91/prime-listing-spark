import { supabase } from "@/integrations/supabase/client";

/**
 * Automatically grants admin role to the first user if no admins exist
 * Call this after successful signup
 */
export const makeFirstUserAdmin = async (userId: string) => {
  try {
    // Check if any admins already exist
    const { data: existingAdmins, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      console.error('Error checking for existing admins:', checkError);
      return false;
    }

    // If no admins exist, make this user an admin
    if (!existingAdmins || existingAdmins.length === 0) {
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin',
        });

      if (insertError) {
        console.error('Error making first user admin:', insertError);
        return false;
      }

      console.log('First user has been granted admin role');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in makeFirstUserAdmin:', error);
    return false;
  }
};
