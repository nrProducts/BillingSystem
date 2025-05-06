import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { to, subject, message, attachment } = req.body;

    try {
        const emailData = {
            from: 'Billing Reports <onboarding@resend.dev>',
            to,
            subject,
            html: `<div>${message}</div>`,
        };

        if (attachment && attachment.filename && attachment.content) {
            emailData.attachments = [
                {
                    filename: attachment.filename,
                    content: attachment.content,
                },
            ];
        }

        const data = await resend.emails.send(emailData);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
