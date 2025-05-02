const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { printBill } = require('./print');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/print', async (req, res) => {
    const { bill, items } = req.body;

    if (!bill || !items) {
        return res.status(400).send('Missing required data for printing');
    }

    try {
        const printerIp = '192.168.1.6';  // Sample IP address of the printer
        //192.168.1.6
        const printerPort = 9100;
        await printBill(printerIp, printerPort, bill, items);
        res.status(200).send('Printing started successfully');
    } catch (err) {
        console.error('Printing Error:', err);
        res.status(500).send('Failed to print bill: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
