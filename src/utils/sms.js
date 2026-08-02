import twilio from 'twilio';

export async function sendSMS(toPhone, messageBody) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    console.warn(`[SMS NOT SENT - Missing Twilio Credentials] To: ${toPhone} | Message: ${messageBody}`);
    return { 
      success: false, 
      error: 'Missing Twilio environment variables. Please verify TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env.local' 
    };
  }

  if (!toPhone || typeof toPhone !== 'string') {
    return { success: false, error: 'Invalid or missing destination phone number' };
  }

  try {
    let formattedPhone = toPhone.trim().replace(/[\s\-\(\)]/g, '');
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }

    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: messageBody,
      from: fromPhone,
      to: formattedPhone
    });
    console.log(`[SMS SENT] SID: ${message.sid} | To: ${formattedPhone}`);
    return { success: true, sid: message.sid, status: message.status };
  } catch (error) {
    console.error(`[SMS FAILED] To: ${toPhone} | Error:`, error);
    let errorMessage = error.message;
    if (error.code === 21608) {
      errorMessage = `Twilio Trial restriction: ${toPhone} is unverified. Trial accounts can only send to verified numbers.`;
    }
    return { success: false, error: errorMessage, code: error.code };
  }
}

