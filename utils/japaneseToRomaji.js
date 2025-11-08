const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

// Initialize Kuroshiro for Japanese to Romaji conversion
let kuroshiro = null;
(async () => {
  try {
    kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());
  } catch (error) {
    console.error('Failed to initialize Kuroshiro:', error);
  }
})();

// Helper function to convert Japanese to Romaji
async function japaneseToRomaji(text) {
  if (!kuroshiro || !text) return '';
  try {
    const romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
    return romaji.toLowerCase().trim();
  } catch (error) {
    console.error('Failed to convert Japanese to Romaji:', error);
    return '';
  }
}

// Helper function to generate slugJa from titleJa
async function generateSlugJaFromTitleJa(titleJa, type = 'program') {
  if (!titleJa || !titleJa.trim()) return '';
  
  let baseSlugJa = '';
  
  // Try to convert Japanese to Romaji for better SEO
  if (kuroshiro) {
    try {
      const romaji = await japaneseToRomaji(titleJa);
      if (romaji && romaji.length > 0) {
        // Convert romaji to slug format
        baseSlugJa = romaji
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim();
      }
    } catch (error) {
      console.error('Error converting Japanese to Romaji:', error);
    }
  }
  
  // Fallback: if romaji conversion failed or empty, try to extract ASCII characters
  if (!baseSlugJa || baseSlugJa.length === 0) {
    let normalized = titleJa
      .toLowerCase()
      .trim();
    
    baseSlugJa = normalized
      .replace(/[^\w\s-]/g, '') // Remove all non-ASCII characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
  }
  
  // Final fallback if still empty
  if (!baseSlugJa || baseSlugJa.length === 0) {
    // Use a simple format: {type}-ja-{timestamp}
    baseSlugJa = `${type}-ja-${Date.now()}`;
  }
  
  return baseSlugJa;
}

module.exports = {
  japaneseToRomaji,
  generateSlugJaFromTitleJa
};


