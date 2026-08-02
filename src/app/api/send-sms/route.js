import { sendSMS } from '@/utils/sms';

export async function POST(req) {
  try {
    const { toPhone, message } = await req.json();

    if (!toPhone || !message) {
      return Response.json(
        { error: 'Both phone number (toPhone) and message content are required.' },
        { status: 400 }
      );
    }

    const result = await sendSMS(toPhone, message);

    if (!result.success) {
      return Response.json(
        { error: result.error, code: result.code },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      sid: result.sid,
      status: result.status,
      message: 'SMS sent successfully!'
    });
  } catch (error) {
    console.error('API Send SMS Error:', error);
    return Response.json(
      { error: error.message || 'Failed to send SMS message' },
      { status: 500 }
    );
  }
}
