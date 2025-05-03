const escpos = require('escpos');

// Required for USB and Bluetooth support
escpos.USB = require('escpos-usb');
// escpos.Bluetooth = require('escpos-bluetooth');

function printBill(connectionType, printerConfig, bill, items) {
    return new Promise((resolve, reject) => {
        let device;

        // Set up device based on connection type
        if (connectionType === 'network') {
            const { ip, port } = printerConfig;
            device = new escpos.Network(ip, port || 9100); // default port 9100
        } else if (connectionType === 'usb') {
            // Automatically pick the first USB device
            const usbDevice = new escpos.USB();
            device = new escpos.USB(usbDevice.device);
        } else if (connectionType === 'bluetooth') {
            const { address } = printerConfig;
            // device = new escpos.Bluetooth(address); // e.g., '01:23:45:67:89:AB'
        } else {
            return reject(new Error('Invalid connection type. Use "network", "usb", or "bluetooth".'));
        }

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
                    console.log('Printed successfully via', connectionType);
                    resolve();
                });
        });
    });
}

module.exports = {
    printBill
};
