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


export async function getBills({ page, pageSize, sortField, sortOrder, startDate, endDate }) {
    let query = supabase
        .from('bills')
        .select(
            `*,
            bill_items (
              items (
                name
              )
            )`, { count: 'exact' }
        );

    // if (search) {
    //     query = query.ilike('id', `%${search}%`);
    // }

    if (startDate && endDate) {
        query = query.gte('created', startDate).lte('created', endDate);
    }

    if (sortField && sortOrder) {
        query = query.order(sortField, { ascending: sortOrder === 'ascend' });
    }

    query = query.range((page - 1) * pageSize, page * pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const transformedData = data.map((bill) => {
        const itemNames = bill.bill_items
            ?.map((bi) => bi.items?.name)
            .filter(Boolean)
            .join(', ') || '';
        return { ...bill, item_names: itemNames };
    });

    return {
        data: transformedData,
        page,
        pageSize,
        total: count,
    };
}


export const getBillSummary = async () => {
    const { data, error } = await supabase
      .rpc('get_daily_bill_summary');
    
    if (error) throw error;
    return data;
  };

export const getSalesByCategory = async () => {
    const { data, error } = await supabase
        .from('bill_items')
        .select(`
        total_amount,
        items ( category_id, category:category_id(name) )
      `);

    if (error) throw error;

    // Aggregate totals by category
    const totals = {};
    data.forEach((item) => {
        const category = item.items?.category?.name || 'Unknown';
        totals[category] = (totals[category] || 0) + parseFloat(item.total_amount);
    });

    return totals;
};


