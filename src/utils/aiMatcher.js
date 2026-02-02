import aiData from '../data/smi_ai_data.json';

export const findAnswer = (input) => {
  if (!input) return null;
  
  const normalizedInput = input.toLowerCase();
  
  // Find the best match
  const match = aiData.find(item => 
    item.keywords.some(keyword => normalizedInput.includes(keyword.toLowerCase()))
  );
  
  if (match) {
    return {
      text: match.answer,
      isFallback: false,
      showContactButton: match.showContactButton || false,
      showTelegramButton: match.showTelegramButton || false
    };
  }
  
  // Fallback response
  return {
    text: "Mohon maaf, saya belum mengerti pertanyaan Anda. Silakan hubungi Admin SMI untuk pertanyaan tersebut agar mendapatkan penjelasan yang lebih lengkap.",
    isFallback: true,
    showContactButton: true
  };
};
