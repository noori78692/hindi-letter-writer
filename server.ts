import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // CORS support for mobile Capacitor WebViews & cross-origin frontend apps
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(express.json({ limit: "5mb" }));

  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GEMINI_API_KEY पर्यावरण चर (environment variable) कॉन्फ़िगर नहीं है।"
        );
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Helper with retries and model fallbacks for Gemini API calls
  async function callGeminiWithRetry(
    ai: GoogleGenAI,
    params: {
      model?: string;
      contents: any;
      config?: any;
    },
    maxRetries = 2
  ) {
    // Model fallback sequence using active Gemini model aliases
    const modelsToTry = [
      params.model || process.env.GEMINI_MODEL || "gemini-3.6-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
    ];

    let lastError: any;

    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: params.contents,
            config: params.config,
          });
          return response;
        } catch (err: any) {
          lastError = err;
          const errMsg = err.message || String(err);
          const is429 = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded");
          console.warn(`Gemini API call (${modelName}, attempt ${attempt + 1}) failed:`, errMsg);

          // If rate limit (429), break immediately to try the next fallback model or fail gracefully
          if (is429) {
            break;
          }

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 800 * Math.pow(2, attempt)));
          }
        }
      }
    }

    // Format 429/Quota errors nicely for the caller
    const finalMsg = lastError?.message || String(lastError);
    if (finalMsg.includes("429") || finalMsg.includes("RESOURCE_EXHAUSTED") || finalMsg.includes("Quota exceeded")) {
      throw new Error("AI अनुरोधों की सीमा (Quota Exceeded) समाप्त हो गई है। कृपया 1 मिनट बाद प्रयास करें या स्थानीय फॉर्म प्रारूप का उपयोग करें।");
    }

    throw lastError;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Route: Generate Letter / Application
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { type, department, category, fields, tone, userPrompt } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `आप एक उत्कृष्ट एवं विशेषज्ञ हिंदी आवेदन एवं पत्र लेखक AI हैं।
आपका कार्य भारतीय शासकीय कार्यालयों, बैंकों, शैक्षणिक संस्थानों एवं निजी कंपनियों के लिए अत्यंत शुद्ध, सम्मानजनक और उचित प्रारूप वाले पत्र/आवेदन लिखना है।
भाषा शुद्ध हिंदी देवनागरी लिपि में होनी चाहिए। व्याकरण और विराम चिह्नों का विशेष ध्यान रखें।
केवल पत्र/आवेदन का मुख्य भाग और प्रारूप दें। कोई अन्य व्याख्यात्मक टिप्पणी या प्रस्तावना न जोड़ें।`;

      let prompt = "";
      if (userPrompt) {
        prompt = `निम्नलिखित विवरण या संक्षिप्त नोट से एक संपूर्ण, स्पष्ट और अत्यधिक औपचारिक ${
          type === "letter" ? "पत्र" : "आवेदन"
        } तैयार करें:
विवरण: "${userPrompt}"
विभाग/प्राधिकारी: ${department || "संबंधित अधिकारी"}
विषय/श्रेणी: ${category || "सामान्य निवेदन"}
शैली/टोन: ${tone || "formal"}
नाम: ${fields?.name || "[नाम]"}
पिता/पति का नाम: ${fields?.fatherName || "[पिता का नाम]"}
पता: ${fields?.address || "[पता]"}
मोबाइल: ${fields?.mobile || "[मोबाइल]"}
दिनांक: ${fields?.date || new Date().toISOString().slice(0, 10)}`;
      } else {
        prompt = `निम्नलिखित जानकारी के आधार पर एक आदर्श ${
          type === "letter" ? "पत्र" : "आवेदन"
        } लिखें:
विभाग: ${department || "संबंधित कार्यालय"}
विषय: ${category || "निवेदन"}
शैली (Tone): ${tone || "formal"}
आवेदक का नाम: ${fields?.name || "[नाम]"}
पिता/पति का नाम: ${fields?.fatherName || "[पिता/पति का नाम]"}
लिंग: ${fields?.gender || "पुरुष"}
पता: ${fields?.address || "[पता]"}
मोबाइल: ${fields?.mobile || "[मोबाइल]"}
ईमेल: ${fields?.email || ""}
अधिकारी का नाम: ${fields?.officerName || ""}
खाता/आईडी/संदर्भ संख्या: ${fields?.idNumber || ""}
गाँव/मोहल्ला: ${fields?.village || ""}
जिला: ${fields?.district || ""}
राज्य: ${fields?.state || ""}
पिन कोड: ${fields?.pincode || ""}
व्यवसाय/पद: ${fields?.occupation || ""}
दिनांक: ${fields?.date || new Date().toISOString().slice(0, 10)}
मुख्य विवरण/कारण: "${fields?.reason || "उचित कार्यवाही हेतु निवेदन।"}"

ध्यान दें:
1. उचित संबोधन (जैसे सेवा में, जिलाधिकारी महोदय, शाखा प्रबंधक, प्रधानाचार्य महोदय आदि) प्रयोग करें।
2. स्पष्ट "विषय:" पंक्ति लिखें।
3. आदरसूचक संबोधन (महोदय/महोदया) प्रयोग करें।
4. मुख्य विषय वस्तु को व्यवस्थित अनुच्छेदों में लिखें।
5. लिंग (पुरुष/महिला) के अनुसार व्याकरणिक सहमति रखें (जैसे 'पुत्र/पुत्री', 'भवदीय/भवदीया', 'आभारी रहूंगा/रहूंगी')।
6. अंत में सधन्यवाद, भवदीय/भवदीया, नाम, पता, संपर्क विवरण एवं दिनांक शामिल करें।`;
      }

      const response = await callGeminiWithRetry(ai, {
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Generate Error:", error);
      res.status(500).json({ error: error.message || "AI पत्र तैयार करने में विफल रहा।" });
    }
  });

  // AI Route: Enhance / Polish / Translate Letter
  app.post("/api/ai/enhance", async (req, res) => {
    try {
      const { action, text, instructions } = req.body;
      if (!text) {
        return res.status(400).json({ error: "पत्र सामग्री अनिवार्य है।" });
      }
      const ai = getGeminiClient();

      const promptsMap: Record<string, string> = {
        short:
          "इस हिंदी आवेदन/पत्र को उसी प्रारूप (सेवा में, विषय, संबोधन, मुख्य भाग, धन्यवाद, हस्ताक्षर) में रखते हुए संक्षिप्त और सारगर्भित करें। अनावश्यक शब्द हटाएं पर सभी आवश्यक तथ्य बनाए रखें।",
        long: "इस हिंदी आवेदन/पत्र को उसी प्रारूप में रखते हुए थोड़ा और विस्तृत, ससम्मान और प्रभावकारी बनाएं।",
        formal:
          "इस हिंदी आवेदन/पत्र को अत्यंत उच्च स्तरीय सरकारी/कार्यालयी शब्दावली (Very Formal Official Hindi) में परिवर्तित करें।",
        simple:
          "इस हिंदी आवेदन/पत्र की भाषा को बहुत ही सरल, सुबोध और स्पष्ट आम हिंदी में बदलें।",
        grammar:
          "इस हिंदी आवेदन/पत्र की व्याकरणिक त्रुटियां, विराम चिह्न और वर्तनी की गलतियों को ठीक करें।",
        english:
          "Translate this Hindi application/letter into a formal, perfectly formatted English application/letter while keeping all structure, placeholders, and details intact.",
        hindi:
          "Convert/Translate this document into pure formal Hindi with proper Devanagari script and official Indian letter layout.",
        legal:
          "इस पत्र में कानूनी/शासकीय धाराओं और औपचारिक शब्दावली (Legal & Government reference terms) का उचित समावेश करते हुए इसे अत्यंत प्रभावशाली बनाएं।",
      };

      const promptText =
        instructions || promptsMap[action] || "इस आवेदन को बेहतर और सुस्पष्ट बनाएं।";

      const response = await callGeminiWithRetry(ai, {
        contents: `${promptText}\n\n---\nमूल पत्र/आवेदन:\n${text}\n---\n\nकेवल संशोधित या अनुवादित पत्र का संपूर्ण टेक्स्ट ही दें। कोई अतिरिक्त टिप्पणी न जोड़ें।`,
        config: {
          temperature: 0.5,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Enhance Error:", error);
      res.status(500).json({ error: error.message || "AI परिमार्जन विफल रहा।" });
    }
  });

  // AI Route: Smart Auto-fill fields from prompt
  app.post("/api/ai/smart-autofill", async (req, res) => {
    try {
      const { userPrompt } = req.body;
      if (!userPrompt) {
        return res.status(400).json({ error: "निर्देश अनिवार्य है।" });
      }
      const ai = getGeminiClient();

      const response = await callGeminiWithRetry(ai, {
        contents: `उपयोगकर्ता के इस लिखित/मौखिक संदेश का विश्लेषण करें और पत्र/आवेदन हेतु फ़ील्ड्स निकालें:
"${userPrompt}"`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: `Extract parameters for a Hindi application form in JSON:
{
  "type": "application" or "letter",
  "department": string (e.g. "जिलाधिकारी", "बैंक मैनेजर", "प्रधानाचार्य", "थाना प्रभारी", "विद्युत विभाग", "तहसीलदार", "नगर निगम", "स्वास्थ्य अधिकारी", etc.),
  "category": string (e.g. "अवकाश हेतु आवेदन", "बैंक खाता", "बिजली शिकायत", "छात्रवृत्ति हेतु आवेदन", "चरित्र प्रमाण पत्र", "सड़क मरम्मत", "पानी शिकायत", "एनओसी", "आरटीआई", etc.),
  "reason": string (a clear 2-4 sentence reason in formal Hindi for the application body),
  "tone": string ("formal", "veryformal", "simple", or "office")
}`,
        },
      });

      let parsed = {};
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("JSON parse error:", e);
      }

      res.json(parsed);
    } catch (error: any) {
      console.error("AI Autofill Error:", error);
      res.status(500).json({ error: error.message || "स्मार्ट ऑटोफिल विफल रहा।" });
    }
  });

  // Vite integration
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
