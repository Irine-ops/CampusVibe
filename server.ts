import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'AI Campus Marketplace API' });
  });

  // AI Assistant route to generate polished campus listing descriptions and price estimates
  app.post('/api/ai-assist', async (req, res) => {
    try {
      const { name, category, condition, userPrompt } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback smart response if no API key present
        return res.json({
          success: true,
          suggestedPrice: category === 'Books' ? 400 : category === 'Cycles' ? 3800 : category === 'Electronics' ? 950 : 500,
          enhancedDescription: `${name} (${condition} condition). Great campus item! Perfect for college students looking for quality gear at an affordable price. Easy pickup at student hostel or tech block.`,
          isFallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const prompt = `You are a helpful AI assistant for a college campus marketplace.
A student is trying to list an item for sale:
- Item Name: ${name || 'Item'}
- Category: ${category || 'Other'}
- Condition: ${condition || 'Good'}
- Additional Notes: ${userPrompt || 'None'}

Please reply in JSON format with two fields:
1. "suggestedPrice": estimated fair resale price in Indian Rupees (₹) for a college student (number only, e.g. 500)
2. "enhancedDescription": a compelling, friendly, concise 2-3 sentence campus listing description highlighting key details and easy campus pickup.

Only return valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({
          success: true,
          suggestedPrice: parsed.suggestedPrice || 500,
          enhancedDescription: parsed.enhancedDescription || '',
        });
      }

      res.json({
        success: true,
        suggestedPrice: 450,
        enhancedDescription: responseText,
      });
    } catch (err) {
      console.error('AI assist error:', err);
      res.json({
        success: false,
        error: 'Could not generate AI suggestion right now.',
        fallbackDescription: `${req.body.name || 'Item'} in ${req.body.condition || 'Good'} condition. Clean and fully functional for campus use.`,
      });
    }
  });

  // Smart Contextual Seller Reply Endpoint
  app.post('/api/chat-seller', async (req, res) => {
    try {
      const { userMessage, item, chatHistory } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ success: false, reason: 'No API Key' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const systemInstruction = `You are ${item.sellerName || 'a student seller'}, a friendly college student selling an item on CampusMarket.
Context about the item you are selling:
- Item: ${item.name}
- Category: ${item.category}
- Price: ₹${item.price}
- Condition: ${item.condition}
- Pickup Location: ${item.pickupLocation} in Vellore campus.
- Description: ${item.description}

Specific Guidelines:
- If the buyer asks "where in campus are you located?" or similar location questions: explicitly state that you are at Vellore campus itself, around ${item.pickupLocation} (near canteen/block).
- If the buyer asks "is the price negotiable?" or similar price questions: give a reasonable, specific answer based on the price ₹${item.price} (e.g. offering a small ₹50-100 discount for quick pickup today, or explaining why ₹${item.price} is already a fair price for ${item.condition} condition).
- Keep your reply short (1 to 2 sentences), natural, friendly, and casual like a fellow student replying on WhatsApp. Do NOT include markdown styling or quotes.`;

      const promptText = `Previous messages: ${JSON.stringify(chatHistory || [])}\nBuyer asked: "${userMessage}"\nReply as the seller:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text ? response.text.trim() : '';
      if (replyText) {
        return res.json({ success: true, reply: replyText });
      }

      res.json({ success: false });
    } catch (err) {
      console.error('Chat seller error:', err);
      res.json({ success: false });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
