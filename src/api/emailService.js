export const sendReportByEmail = async (body) => {
    try {
      const res = await fetch('/api/sendemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
  
      const data = await res.json();
  
      if (data.success) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email:', data.error);
      }
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  };
  