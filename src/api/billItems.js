import { supabase } from '../supabase/client'

export const createBillItems = async (billItems) => {
    const { data, error } = await supabase
        .from("bill_items")
        .insert(billItems)
        .select();

    if (error) {
        console.error('Error adding BillItems:', error.message);
        return { data: [], message: error?.message, error, success : false };
    }

    return { data: data, message: 'BillItems added successfully', error: null, success : true  };
};
