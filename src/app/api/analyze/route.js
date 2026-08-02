import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60; // Allow up to 60 seconds for AI analysis

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'GEMINI_API_KEY is not configured. Please check your .env.local file.' }, { status: 500 });
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

      const prompt = `You are a strict veterinary AI assistant with zero tolerance for errors.

STEP 1 - CRITICAL ANIMAL VERIFICATION:
Examine this image with extreme care. Ask yourself: Does this image contain a real, living, physical animal (dog, cat, cow, goat, bird, horse, monkey, etc.)?

Respond with ONLY "NO_ANIMAL_DETECTED" if:
- The image shows a human (person, face, selfie, full body)
- The image shows objects, furniture, cars, buildings, roads, food, plants, or any non-animal subject
- The image is a cartoon, drawing, painting, or illustration
- The image is blurry or unclear and you cannot confirm an animal
- You are even slightly unsure whether an animal is present

STEP 2 - ONLY if a real injured/distressed animal is CLEARLY visible:
Return a JSON object with this exact structure (no markdown, no extra text):
{
  "isAnimal": true,
  "species": "species name and breed if identifiable",
  "condition": "detailed description of visible physical condition",
  "injuries": ["injury 1", "injury 2"],
  "urgencyLevel": "HIGH" or "MEDIUM" or "LOW",
  "urgencyReason": "why this urgency level was assigned",
  "immediateSteps": ["step 1 for the person nearby", "step 2 for the person nearby"],
  "vetRecommendation": "what treatment is likely needed"
}

IMPORTANT: If there is ANY doubt that the image shows an injured or distressed animal, respond with only: NO_ANIMAL_DETECTED`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64.split(',')[1],
            mimeType: imageBase64.split(';')[0].split(':')[1],
          },
        },
      ]);

      const responseText = result.response.text().trim();

      if (responseText.includes('NO_ANIMAL_DETECTED')) {
        return Response.json({ isAnimal: false, message: 'No animal detected in the image. Please upload a clear photo of the injured animal.' });
      }

      // Try to parse as JSON for structured output
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return Response.json({ isAnimal: true, analysis: parsed, rawText: responseText });
        }
      } catch (_) {}

      // Fallback: return as raw text if JSON parsing fails
      return Response.json({ isAnimal: true, analysis: null, rawText: responseText });

    } catch (apiError) {
      console.error('Gemini API call failed:', apiError);
      return Response.json({
        error: `AI Analysis Error: ${apiError.message || 'Verification failed. Please check your GEMINI_API_KEY.'}`
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
    return Response.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
