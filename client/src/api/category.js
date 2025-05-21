import { supabase } from '../supabase/client'

export const fetchCategory = async () => {
  const { data, error } = await supabase
    .from('category')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching category:', error.message);
    return { data: [], message: error?.message, error };
  }
  return { data: data, message: 'Items fetched successfully', error: null };
};

export const addCategory = async (item) => {
  const { data, error } = await supabase
    .from('category')
    .insert(item)
    .select();

  if (error) {
    console.error('Error adding category:', error.message);
    return { data: [], message: error?.message, error };
  }

  return { data: data[0], message: 'category added successfully', error: null };
}