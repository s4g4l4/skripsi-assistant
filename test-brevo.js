const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@dukunskripsi.id';

async function testEmail() {
  console.log("Testing Brevo API...");
  console.log("Sender:", senderEmail);
  console.log("API Key exists:", !!brevoApiKey);
  
  if (!brevoApiKey) {
    console.log("No API key found.");
    return;
  }
  
  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Dukun Skripsi', email: senderEmail },
        to: [{ email: 'febricase@gmail.com', name: 'Test User' }],
        subject: 'Test Email Dukun Skripsi',
        htmlContent: '<p>This is a test email.</p>'
      })
    });

    if (!brevoRes.ok) {
      console.error('❌ Brevo API Error:', brevoRes.status, await brevoRes.text());
    } else {
      console.log('✅ Success:', await brevoRes.json());
    }
  } catch (err) {
    console.error('❌ Network/Fetch Error:', err);
  }
}

testEmail();
