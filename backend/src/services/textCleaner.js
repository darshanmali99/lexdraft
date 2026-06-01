// ======================================
// CLEAN RAW EXTRACTED TEXT
// ======================================

const cleanText = (rawText) => {

  if (!rawText) {
    return "";
  }

  let cleaned = rawText;


  // ======================================
  // REMOVE EXTRA SPACES
  // ======================================

  cleaned = cleaned.replace(/\s+/g, " ");


  // ======================================
  // REMOVE MULTIPLE NEWLINES
  // ======================================

  cleaned = cleaned.replace(/\n{2,}/g, "\n");


  // ======================================
  // REMOVE PAGE NUMBERS
  // ======================================

  cleaned = cleaned.replace(/Page\s+\d+/gi, "");


  // ======================================
  // REMOVE COMMON PDF FOOTER NOISE
  // ======================================

  cleaned = cleaned.replace(/Confidential/gi, "Confidential");


  // ======================================
  // TRIM TEXT
  // ======================================

  cleaned = cleaned.trim();


  return cleaned;
};


export default cleanText;