import { supabase } from '../supabase/client'


export const createBills = async (bill) => {
    const { data, error } = await supabase
        .from("bills")
        .insert(bill)
        .select()
        .single();

    if (error) {
        console.error('Error adding Bills:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    return { data: data, message: 'Bill created successfully', error: null, success: true };
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

    if (startDate && endDate) {
        query = query.gte('created', startDate).lte('created', endDate);
    }

    if (sortField && sortOrder) {
        query = query.order(sortField, { ascending: sortOrder === 'ascend' });
    }

    query = query.range((page - 1) * pageSize, page * pageSize - 1);

    const { data, count, error } = await query;
    if (error) {
        console.error('Error fetching bills:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

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
        success: true
    };
}


export const getBillSummary = async () => {
    const { data, error } = await supabase
        .rpc('get_daily_bill_summary');

    if (error) {
        console.error('Error fetching billSummary:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }
    return { data: data, message: 'BillItems added successfully', error: null, success : true  };
};

export const getSalesByCategory = async () => {
    const { data, error } = await supabase
        .from('bill_items')
        .select(`
        total_amount,
        items ( category_id, category:category_id(name) )
      `);

    if (error) {
        console.error('Error fetching:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }

    // Aggregate totals by category
    const totals = {};
    data.forEach((item) => {
        const category = item.items?.category?.name || 'Unknown';
        totals[category] = (totals[category] || 0) + parseFloat(item.total_amount);
    });
    return { data: totals, message: 'Sales Category added successfully', error: null, success : true  };
};

export const fetchReportData = async (from, to) => {
    const { data, error } = await supabase
        .from('bills')
        .select(`
        id, created, total_gst, grand_total,
        bill_items(
          quantity, price, gst_rate, gst_amount, total_amount,
          items(name)
        )
      `)
        .gte('created', from)
        .lte('created', to);

    if (error) {
        console.error('Error fetching:', error.message);
        return { data: [], message: error?.message, error, success: false };
    }
    return { data: data, message: 'Report Data fetched successfully', error: null, success : true  };
};

