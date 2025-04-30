import { supabase } from '../supabase/client'


export const createBills = async (bill) => {
    const { data, error } = await supabase
        .from("bills")
        .insert(bill)
        .select()
        .single();

    if (error) {
        console.error('Error adding Bills:', error.message);
        return { data: [], message: error?.message, error };
    }

    return { data: data, message: 'Bills added successfully', error: null };
};


