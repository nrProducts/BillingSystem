const express = require('express');
const puppeteer = require('puppeteer');
const pdfPrinter = require('pdf-to-printer');
const cors = require('cors');

const app = express();

// Enable CORS for specific origin (React on localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json({ limit: '5mb' }));

app.post('/api/print-bill', async (req, res) => {
    const { html, billId } = req.body;

    if (!html || !billId) {
        return res.status(400).json({ error: "Missing HTML or Bill ID" });
    }

    try {
        // Launch Puppeteer browser and generate PDF
        const browser = await puppeteer.launch({ headless: true }); // headless mode for no UI
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF as a buffer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Send the PDF buffer to the printer directly using pdf-to-printer
        await pdfPrinter.print(pdfBuffer);

        res.json({ success: true, message: 'Bill sent to printer' });
    } catch (err) {
        console.error("Print error:", err);
        res.status(500).json({ error: 'Failed to generate or print bill' });
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
