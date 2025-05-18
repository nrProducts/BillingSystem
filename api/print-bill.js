import puppeteer from 'puppeteer';
import pdfPrinter from 'pdf-to-printer';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, billId } = req.body;
  if (!html || !billId) {
    return res.status(400).json({ error: 'Missing HTML or Bill ID' });
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

    res.status(200).json({ success: true, message: 'Bill sent to printer' });
  } catch (error) {
    console.error('Print error:', error);
    res.status(500).json({ error: 'Failed to generate or print bill' });
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}
