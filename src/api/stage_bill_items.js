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

export const getStageBillItemsByTableId = async (id) => {
    const { data, error } = await supabase
        .from('stage_bill_items')
        .select('*')
        .eq('table_id', id)
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

export const deleteStageBillItemsByTable = async (tableId) => {
    const { error } = await supabase
        .from('stage_bill_items')
        .delete()
        .eq('table_id', tableId);

    if (error) {
        console.error('Error deleting stage_bill_items by table_id:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return {
        data: null,
        message: 'stage_bill_items deleted successfully for table_id',
        error: null,
        success: true,
    };
};

export const deleteStageBillItemsByBill = async (billId) => {
    const { error } = await supabase
        .from('stage_bill_items')
        .delete()
        .eq('bill_id', billId);

    if (error) {
        console.error('Error deleting stage_bill_items by bill_id:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return {
        data: null,
        message: 'stage_bill_items deleted successfully for bill_id',
        error: null,
        success: true,
    };
};



export const saveStageBillItems = async (stage_bill_items) => {
    const itemsToInsert = stage_bill_items.filter(item => !item.id || item.id === 0);
    const itemsToUpdate = stage_bill_items.filter(item => item.id && item.id !== 0);

    let insertResult = { data: [], error: null };
    let updateResults = [];

    // Insert new items
    if (itemsToInsert.length > 0) {
        const cleanedItemsToInsert = itemsToInsert.map(({ id, ...rest }) => rest);
        console.info(cleanedItemsToInsert, 'inser data')
        const { data, error } = await supabase
            .from('stage_bill_items')
            .insert(cleanedItemsToInsert)
            .select();

        if (error) {
            console.info(error, 'error')
            console.error('Error inserting items:', error.message);
            return { success: false, message: 'Insert failed', error, data: [] };
        }

        insertResult.data = data;
    }

    // Update existing items
    for (const item of itemsToUpdate) {
        const { id, ...updates } = item;
        const { data, error } = await supabase
            .from('stage_bill_items')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error(`Error updating item with ID ${id}:`, error.message);
            return { success: false, message: `Update failed for ID ${id}`, error, data: [] };
        }

        updateResults.push(data[0]);
    }

    return {
        success: true,
        message: 'Items inserted/updated successfully',
        error: null,
        data: [...insertResult.data, ...updateResults],
    };
};
