import twilio from 'twilio';

/**
 * Sanitizes SMS text to be GSM-7 compatible:
 * - Converts common emojis into clean ASCII tags (e.g. [ALERT], [HIGH], [OK])
 * - Removes non-ASCII characters to avoid UCS-2 encoding (which limits SMS segments)
 * - Limits character length to prevent Twilio Trial segment error 30044
 */
export function sanitizeForSMS(text, maxLength = 260) {
  if (!text) return '';
  
  let cleaned = String(text)
    .replace(/\u{1F6A8}|\u{26A0}\u{FE0F}?|\u{203C}\u{FE0F}?/gu, '[ALERT]')
    .replace(/\u{2705}|\u{2714}\u{FE0F}?/gu, '[OK]')
    .replace(/\u{1F534}/gu, '[HIGH]')
    .replace(/\u{1F7E1}/gu, '[MED]')
    .replace(/\u{1F7E2}/gu, '[LOW]')
    .replace(/\u{1FA7A}|\u{1F3E5}|\u{1F691}|\u{1F489}/gu, '[RESCUE]')
    .replace(/\u{1F449}|\u{27A1}\u{FE0F}?|\u{25BA}/gu, '->')
    .replace(/\u{1F4CD}|\u{1F4CC}/gu, 'Loc: ')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[^\x20-\x7E\n\r]/g, '')
    .trim();

  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3) + '...';
  }
  return cleaned;
}

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

    const cleanBody = sanitizeForSMS(messageBody);

    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: cleanBody,
      from: fromPhone,
      to: formattedPhone
    });
    console.log(`[SMS SENT] SID: ${message.sid} | Status: ${message.status} | To: ${formattedPhone}`);
    return { success: true, sid: message.sid, status: message.status };
  } catch (error) {
    console.error(`[SMS FAILED] To: ${toPhone} | Error:`, error);
    let errorMessage = error.message;
    if (error.code === 21608) {
      errorMessage = `Twilio Trial restriction: ${toPhone} is unverified. Trial accounts can only send to verified numbers in Twilio Console.`;
    } else if (error.code === 30044) {
      errorMessage = `Twilio Trial segment limit exceeded. Message was too long for trial tier.`;
    } else if (error.code === 21211) {
      errorMessage = `Invalid destination phone number: ${toPhone}`;
    }
    return { success: false, error: errorMessage, code: error.code };
  }
}


