import { supabase } from '../supabase/client'

export const sendReportByEmail = async (csvContent) => {

    const emailId = sessionStorage.getItem('emailId');

    const { error: funcError } = await supabase.functions.invoke('send-report', {
        body: { csv: csvContent, emailId }
    });

    if (funcError) throw funcError;
};
