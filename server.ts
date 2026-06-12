import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI server-side with key and aistudio-build User-Agent
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment variables. Assistant will run in simulated mode.");
}

app.use(express.json());

// API: AI Wellness Coach route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request payload. Expected an array of 'messages'." });
    }

    if (!ai) {
      // Return a simulated friendly fallback if API key is not available
      const lastUserMsg = messages[messages.length - 1]?.content || "Hello";
      let simulatedReply = "I am here as your warm FitMantra Coach. Even though my AI engine is sleeping temporarily (missing API key), I'm still cheering for you! Let's take a deep breath together. Practice inhaling for 4 seconds, holding for 4, and exhaling for 4. What simple step are we taking today?";
      if (lastUserMsg.toLowerCase().includes("stress") || lastUserMsg.toLowerCase().includes("fatigue")) {
        simulatedReply = "I hear you, and it's completely natural to feel overwhelmed or exhausted after a busy work day. Let's do a fast 2-minute posture check: pull your shoulders back, let your arms hang loosely, and drink a glass of room-temperature water. You are doing great. No pressure!";
      } else if (lastUserMsg.toLowerCase().includes("sleep")) {
        simulatedReply = "A good night's sleep is the foundation of energy. Try skipping screen time for 20 minutes before bed, dim the lights, and do simple tummy breathing. Even 15 minutes of quiet rest makes a big difference for your body!";
      } else if (lastUserMsg.toLowerCase().includes("belly") || lastUserMsg.toLowerCase().includes("fat") || lastUserMsg.toLowerCase().includes("weight")) {
        simulatedReply = "A healthier body is built with love, not punishment. Instead of worrying about intensive workouts, let's start with a relaxed 10-minute walk after lunch or dinner, and drink plenty of water. It's gentle, fits into a busy schedule, and does wonders for digestion!";
      }
      return res.json({ text: simulatedReply });
    }

    // Format chat history for Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are "FitMantra AI Coach", a warm, deeply empathetic, and supportive wellness companion for Indian middle-class professionals aged 25-45 who are striving to improve their physical and mental health. 
Your persona is not a medical clinical officer, standard gym trainer, or machine. You are a supportive smart friend who speaks with kind, encouraging, and emotionally supportive wisdom.
Focus user conversations on these main, relatable pain points:
- Sedentary lifestyle, neck and back fatigue at desks (invite brief stretching, posture resets, taking tea glass breaks).
- High stress levels, work-life imbalance (encourage 2-3 minute mindfulness, 4-7-8 deep breathing exercises).
- Poor sleep, sluggish mornings (help structure screen-free habits, evening wind-down rituals, gentle warm beverages).
- Stubborn belly fat, sluggish energy, inconsistent routines (advocate simple walk milestones, reduced sweetened chai, easy portion balance like extra salad/curd without drastic restriction).

Always structure your replies as:
- Concise, inviting, and easy to read. Use clean paragraph breaks and gentle bullet points if helpful.
- Rooted in organic, affordable, and practical choices for users in India (such as warm water, lemon curd, home-cooked subzi-dal, light brisk steps after a meal).
- Absolutely free of red-zone toxic gym culture, bodybuilding guilt, calorie counters, or harsh instructions. Focus entirely on small wins, daily steps, and self-acceptance. Promote wellness as a gentle daily ritual. Ask supportive, soft questions to keep the user engaged.`,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm with you. Let's take a deep breath and start fresh.";
    res.json({ text });
  } catch (err: any) {
    console.error("Gemini Coach API Error:", err);
    res.status(500).json({ error: err.message || "Failed to communicate with the coaching assistant." });
  }
});

// Serve frontend assets and start listening
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FitMantra] Full-stack server active on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
