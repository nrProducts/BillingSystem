const escpos = require('escpos');

function printBill(printerIp, printerPort, bill, items) {
    return new Promise((resolve, reject) => {
        const device = new escpos.Network(printerIp, printerPort); // Use printerPort passed by the user
        const printer = new escpos.Printer(device);

        const billText = `
Bill ID     : ${bill.id}
User ID     : ${bill.user_id}
Total GST   : ${bill.total_gst}
Grand Total : ${bill.grand_total}

Items:
${items.map(item => `${item.quantity} x ${item.price} = ${item.total_amount}`).join('\n')}
`;

        device.open((err) => {
            if (err) {
                console.error('Printer connection error:', err);
                return reject(err);
            }

            printer
                .text(billText)
                .cut()
                .close(() => {
                    console.log('Printed successfully to', printerIp);
                    resolve();
                });
        });
    });
}

module.exports = {
    printBill
};
