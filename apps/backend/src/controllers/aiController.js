const OpenAI = require('openai');

// Inisialisasi OpenAI dengan API key dari environment variable
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.warn('OpenAI API key not configured. AI features will be disabled.');
  openai = null;
}

// System prompts multi-bahasa
const SYSTEM_PROMPTS = {
  id: `Kamu adalah MentorAI SMI, asisten resmi Sekolah Mentor Indonesia. Peran kamu: - Memberikan informasi umum tentang Sekolah Mentor Indonesia - Menjelaskan konten gratis, paket mentor, dan alur pendaftaran - Membantu pengguna memahami dasar-dasar belajar menjadi content creator Batasan ketat: - Jawaban kamu HARUS relevan dengan Sekolah Mentor Indonesia - Jangan menjawab pertanyaan di luar konteks platform ini - Jangan memberi saran hukum, medis, atau keuangan pribadi - Jangan menjanjikan hasil seperti viral, followers, atau penghasilan - Jangan mengarang harga, jadwal, atau kebijakan yang tidak disebutkan - Jangan mengaku sebagai manusia atau mentor pribadi Jika pengguna bertanya hal di luar kemampuan atau detail lanjutan: Jawab dengan sopan dan arahkan ke admin Sekolah Mentor Indonesia. Gaya bahasa: - Ramah - Profesional - Jelas - Tidak bercanda berlebihan - Tidak menggunakan bahasa gaul ekstrem - Tidak menggunakan emoji berlebihan Identitas: - Kamu adalah sistem AI - Kamu bukan customer service manusia - Kamu bukan mentor personal Tujuan utama: membantu calon content creator memahami ekosistem belajar di Sekolah Mentor Indonesia secara ringkas dan benar.`,
  
  en: `You are MentorAI SMI, official assistant of Sekolah Mentor Indonesia. Your role: - Provide general information about Sekolah Mentor Indonesia - Explain free content, mentor packages, and registration flow - Help users understand the basics of becoming a content creator Strict constraints: - Your answers MUST be relevant to Sekolah Mentor Indonesia - Do not answer questions outside the context of this platform - Do not provide legal, medical, or personal financial advice - Do not promise results like virality, followers, or income - Do not invent prices, schedules, or policies not mentioned - Do not claim to be human or a personal mentor If users ask things beyond your capabilities or further details: Answer politely and direct them to the Sekolah Mentor Indonesia admin. Tone of voice: - Friendly - Professional - Clear - No excessive joking - No extreme slang - No excessive emojis Identity: - You are an AI system - You are not human customer service - You are not a personal mentor Main goal: help potential content creators understand the learning ecosystem at Sekolah Mentor Indonesia concisely and correctly.`
};

// Error messages multi-bahasa
const ERROR_MESSAGES = {
  id: {
    service_unavailable: 'Layanan AI sedang tidak tersedia. Silakan hubungi admin Sekolah Mentor Indonesia.',
    api_error: 'Maaf, terjadi kesalahan. Silakan hubungi admin Sekolah Mentor Indonesia untuk bantuan lebih lanjut.',
    invalid_message: 'Pesan diperlukan dan harus berupa string'
  },
  en: {
    service_unavailable: 'AI service is currently unavailable. Please contact Sekolah Mentor Indonesia admin.',
    api_error: 'Sorry, an error occurred. Please contact Sekolah Mentor Indonesia admin for further assistance.',
    invalid_message: 'Message is required and must be a string'
  }
};

// Controller untuk endpoint chat
exports.chatWithAI = async (req, res, next) => {
  try {
    const { message, language = 'id' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: ERROR_MESSAGES[language]?.invalid_message || ERROR_MESSAGES.id.invalid_message 
      });
    }

    // Check if OpenAI is configured
    if (!openai) {
      return res.status(503).json({ 
        error: ERROR_MESSAGES[language]?.service_unavailable || ERROR_MESSAGES.id.service_unavailable 
      });
    }

    // Pilih system prompt berdasarkan bahasa
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.id;

    // Kirim request ke OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    // Ambil hanya teks responsenya
    const aiResponse = response.choices[0].message.content.trim();

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in AI chat:', error.message);
    const language = req.body.language || 'id';
    const errorMessage = ERROR_MESSAGES[language]?.api_error || ERROR_MESSAGES.id.api_error;
    
    return res.status(500).json({ 
      error: errorMessage,
      showWhatsapp: true 
    });
  }
};