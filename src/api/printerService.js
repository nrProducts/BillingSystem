export const printBill = async (billHtml, billId) => {
    try {
        const response = await fetch('/api/print-bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ html: billHtml, billId })
        });

        const result = await response.json();

        return result;
    } catch (err) {
        console.error('Print error:', err);
        throw err;
    }
};
