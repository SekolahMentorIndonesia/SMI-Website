export async function POST(request) {
  try {
    const { message } = await request.json();
    
    // Pastikan API key tersedia
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // Daftar model Gemini yang didukung (gunakan model yang stabil dan terverifikasi)
    const supportedModels = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest'
    ];
    
    let response;
    let aiResponse;
    let modelIndex = 0;
    let success = false;
    
    // Coba model satu per satu sampai menemukan yang berhasil
    while (!success && modelIndex < supportedModels.length) {
      const currentModel = supportedModels[modelIndex];
      try {
        // Kirim permintaan ke Gemini API dengan model yang saat ini dicoba
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${currentModel}:generateContent?key=${apiKey}`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Anda adalah MentorAI SMI (Sekolah Mentor Indonesia), asisten virtual yang membantu dengan pertanyaan seputar pembelajaran, konsultasi, dan pendaftaran Sekolah Mentor Indonesia. Juga jawab pertanyaan umum yang relevan dengan pendidikan dan content creation.\n\nAturan penting:\n- Jika Anda tidak tahu jawaban atau pertanyaan di luar konteks pendidikan/content creation, jawab dengan: "Maaf, saya tidak memiliki informasi mengenai hal tersebut. Silakan hubungi admin Sekolah Mentor Indonesia untuk bantuan lebih lanjut."\n- Gunakan bahasa yang ramah, informatif, dan sesuai dengan konteks\n- Jangan membuat informasi yang tidak sesuai dengan Sekolah Mentor Indonesia\n\nPertanyaan: ${message}`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`Model ${currentModel} tidak dapat diakses`);
        }
        
        const data = await response.json();
        
        // Pastikan respons memiliki format yang valid
        if (data.candidates && data.candidates[0] && data.candidates[0].content && 
            data.candidates[0].content.parts && data.candidates[0].content.parts[0] && 
            data.candidates[0].content.parts[0].text) {
          
          aiResponse = data.candidates[0].content.parts[0].text;
          success = true;
        } else {
          throw new Error(`Format respons dari model ${currentModel} tidak valid`);
        }
      } catch (modelError) {
        console.error(`Model ${currentModel} gagal:`, modelError.message);
        modelIndex++;
      }
    }
    
    // Jika semua model gagal, gunakan fallback mock responses
    if (!success) {
      // Mock responses dari i18n file sebagai fallback
      const mockResponses = {
        fallback: "Maaf, saya tidak memiliki informasi mengenai hal tersebut. Silakan hubungi admin Sekolah Mentor Indonesia untuk bantuan lebih lanjut.",
        greeting: "Halo! Saya MentorAI SMI. Ada yang bisa saya bantu seputar pembelajaran atau pendaftaran di Sekolah Mentor Indonesia?",
        register: "Untuk mendaftar di Sekolah Mentor Indonesia, kamu bisa membuat akun terlebih dahulu melalui tombol Daftar di halaman utama. Setelah itu, kamu dapat mengakses konten gratis atau memilih paket mentor sesuai kebutuhan.",
        viral: "Saya bisa memberikan panduan umum tentang pembuatan konten, namun tidak bisa menjamin hasil seperti viral, jumlah followers, atau penghasilan tertentu. Untuk pendampingan lebih lanjut, kamu bisa mempertimbangkan paket mentor yang tersedia.",
        pricing: "Sekolah Mentor Indonesia menyediakan 3 paket mentoring: PERAK (199rb), PREMI (499rb), dan PROFESIONAL (1.2jt). Kamu bisa melihat detail lengkap fiturnya di bagian 'Paket Mentoring' pada halaman utama.",
        free: "Kami menyediakan berbagai konten gratis seperti artikel, video dasar, dan e-book panduan untuk membantu kamu memulai perjalanan sebagai content creator. Silakan daftar akun untuk mengakses library konten gratis kami.",
        identity: "Saya adalah MentorAI SMI, sistem AI asisten resmi Sekolah Mentor Indonesia. Saya bukan mentor pribadi atau customer service manusia, namun saya siap membantu memberikan informasi umum seputar platform ini.",
        forbidden: "Maaf, sebagai MentorAI SMI, saya tidak berwenang memberikan saran hukum, medis, atau keuangan pribadi. Fokus saya adalah membantu kamu memahami ekosistem belajar di Sekolah Mentor Indonesia."
      };
      
      // Keywords untuk menentukan jenis pertanyaan
      const keywords = {
        greeting: ["halo", "pagi", "siang", "malam", "hai"],
        register: ["daftar", "cara gabung", "buat akun", "register"],
        viral: ["viral", "followers", "kaya", "duit", "penghasilan"],
        pricing: ["paket", "harga", "biaya", "bayar", "mentoring"],
        free: ["gratis", "free", "cuma-cuma"],
        identity: ["siapa kamu", "manusia", "orang", "ai", "robot"],
        forbidden: ["investasi", "keuangan", "hukum", "obat", "sakit"]
      };
      
      // Tentukan jenis pertanyaan berdasarkan keyword
      let responseType = "fallback";
      const lowerMessage = message.toLowerCase();
      
      // Daftar topik yang relevan dengan SMI
      const relevantTopics = [
        "pendaftaran", "daftar", "mentoring", "paket", "harga", "gratis", "konten",
        "belajar", "creator", "content", "platform", "admin", "sekolah", "mentor",
        "indonesia", "smi", "program", "viral", "followers", "penghasilan"
      ];
      
      // Cek apakah pertanyaan relevan dengan SMI
      const isRelevant = relevantTopics.some(topic => lowerMessage.includes(topic));
      
      // Hanya gunakan keyword matching jika pertanyaan relevan
      if (isRelevant) {
        for (const [type, words] of Object.entries(keywords)) {
          if (words.some(word => lowerMessage.includes(word))) {
            responseType = type;
            break;
          }
        }
      }
      
      aiResponse = mockResponses[responseType] || mockResponses.fallback;
    }
    
    // Tentukan apakah perlu menampilkan tombol WhatsApp (jika AI tidak bisa jawab)
    const showWhatsapp = aiResponse.includes("tidak memiliki informasi") || aiResponse.includes("hubungi admin");
    
    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        showWhatsapp: showWhatsapp
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error dalam AI chat:', error);
    return new Response(
      JSON.stringify({ 
        response: 'Maaf, terjadi kesalahan. Silakan hubungi admin Sekolah Mentor Indonesia untuk bantuan lebih lanjut.',
        showWhatsapp: true
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}