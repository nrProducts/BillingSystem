import { supabase } from '../supabase/client'

export const fetchItems = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('id, user_id, name, category_id, category:category_id(name), price, is_active, created, gst_rate, hsn_code')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching items:', error.message);
    return { data: [], message: error?.message, error };
  } else {
    const updatedItems = data.map(item => ({
      ...item,
      category: item.category ? item.category.name : null
    }));

    return { data: updatedItems, message: 'Items fetched successfully', error: null };
  }
};

export const addItem = async (item) => {
  const { data, error } = await supabase
    .from('items')
    .insert(item)
    .select();

  if (error) {
    console.error('Error adding items:', error.message);
    return { data: [], message: error?.message, error };
  }

  return { data: data[0], message: 'Item added successfully', error: null };
};

export const updateItem = async (id, updates) => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating items:', error.message);
    return { data: [], message: error?.message, error };
  }

  return { data: data[0], message: 'Item updated successfully', error: null };
};

export const deleteItem = async (id) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting items:', error.message);
    return { data: [], message: error?.message, error };
  }

  return { data: null, message: 'Item deleted successfully', error: null };
};



