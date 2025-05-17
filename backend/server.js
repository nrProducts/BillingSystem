const express = require('express');
const puppeteer = require('puppeteer');
const pdfPrinter = require('pdf-to-printer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

app.post('/api/print-bill', async (req, res) => {
    const { html, billId } = req.body;

    if (!html || !billId) {
        return res.status(400).json({ error: "Missing HTML or Bill ID" });
    }

    const tempPath = path.join(os.tmpdir(), `bill-${billId}.pdf`);

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();
        fs.writeFileSync(tempPath, pdfBuffer);

        const printers = await pdfPrinter.getPrinters();
        if (!printers.length) {
            return res.status(500).json({ error: 'No printers available' });
        }

        await pdfPrinter.print(tempPath);
        res.json({ success: true, message: 'Bill sent to printer' });
    } catch (err) {
        console.error("Print error:", err);
        res.status(500).json({ error: 'Failed to generate or print bill' });
    } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
