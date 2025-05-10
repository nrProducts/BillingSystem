import { supabase } from '../supabase/client'

export const fetchStageBillItems = async () => {
    const { data, error } = await supabase
        .from('stage_bill_items')
        .select('*')
        .order('id');

    if (error) {
        console.error('Error fetching stage_bill_items:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data, message: 'stage_bill_items fetched successfully', error: null, success: true };
};

export const addStageBillItems = async (stage_bill_items) => {
    const { data, error } = await supabase
        .from('stage_bill_items')
        .insert(stage_bill_items)
        .select();

    if (error) {
        console.error('Error adding stage_bill_items:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: data[0], message: 'stage_bill_items added successfully', error: null, success: true };
};

export const updateStageBillItems = async (id, updates) => {
    const { data, error } = await supabase
        .from('stage_bill_items')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating stage_bill_items:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: data[0], message: 'stage_bill_items updated successfully', error: null, success: true };
};

export const deleteStageBillItems = async (id) => {
    const { error } = await supabase
        .from('stage_bill_items')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting stage_bill_items:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: null, message: 'stage_bill_items deleted successfully', error: null, success: true };
};
