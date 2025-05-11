import { supabase } from '../supabase/client'

export const fetchUserDetails = async () => {
  const { data, error } = await supabase
    .from('user_details')
    .select('*')

  if (error) {
    console.error('Error fetching items:', error.message);
    return { data: [], message: error?.message, error, success: false };
  } else {


    return { data: data?.[0], message: 'Items fetched successfully', error: null, success: true };
  }
};

export const addUserDetails = async (item) => {
  const { data, error } = await supabase
    .from('user_details')
    .insert(item)
    .select();

  if (error) {
    console.error('Error adding user details:', error.message);
    return { data: [], message: error?.message, error, success: false };
  }

  return { data: data[0], message: 'User details added successfully', error: null, success: true };
};

export const updateUserDetails = async (id, updates) => {
  const { data, error } = await supabase
    .from('user_details')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating user:', error.message);
    return { data: [], message: error?.message, error, success: false };
  }

  return { data: data[0], message: 'User updated successfully', error: null, success: true };
};

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('user_details')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error.message);
    return { data: null, message: error?.message, error, success: false };
  }

  return { data, message: 'User fetched successfully', error: null, success: true };
};


export const fetchAllUserDetails = async () => {
  const { data, error } = await supabase
    .from('view_all_users')
    .select('*')

  if (error) {
    console.error('Error fetching items:', error.message);
    return { data: [], message: error?.message, error, success: false };
  } else {


    return { data, message: 'Items fetched successfully', error: null, success: true };
  }
};