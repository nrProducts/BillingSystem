import { supabase } from '../supabase/client'

export const fetchTables = async () => {
    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('id');

    if (error) {
        console.error('Error fetching tables:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data, message: 'Tables fetched successfully', error: null, success: true };
};

export const getTableById = async (id) => {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error('Error fetching tables:', error.message);
      return { data: null, message: error?.message, error, success: false };
    }
  
    return { data, message: 'Tables fetched successfully', error: null, success: true };
  };

export const addTable = async (table) => {
    const { data, error } = await supabase
        .from('tables')
        .insert(table)
        .select();

    if (error) {
        console.error('Error adding table:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: data[0], message: 'Table added successfully', error: null, success: true };
};

export const updateTable = async (id, updates) => {
    const { data, error } = await supabase
        .from('tables')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating table:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: data[0], message: 'Table updated successfully', error: null, success: true };
};

export const deleteTable = async (id) => {
    const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting table:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: null, message: 'Table deleted successfully', error: null, success: true };
};
