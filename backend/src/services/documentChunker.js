// ======================================
// SMART LEGAL DOCUMENT CHUNKER
// ======================================

const chunkText = (
  text,
  chunkSize = 1200,
  overlap = 200
) => {

  if (!text) {
    return [];
  }


  // ======================================
  // NORMALIZE TEXT
  // ======================================

  const normalized = text
    .replace(/\s+/g, " ")
    .trim();


  // ======================================
  // SPLIT INTO SENTENCES
  // ======================================

  const sentences = normalized.match(
    /[^.!?]+[.!?]+/g
  ) || [normalized];


  const chunks = [];

  let currentChunk = "";

  let chunkIndex = 0;


  // ======================================
  // BUILD SEMANTIC CHUNKS
  // ======================================

  for (const sentence of sentences) {

    if (
      (currentChunk + sentence).length
      > chunkSize
    ) {

      chunks.push({

        chunk_index: chunkIndex,

        content: currentChunk.trim(),

        word_count:
          currentChunk.trim().split(/\s+/).length
      });


      // OVERLAP
      currentChunk =
        currentChunk.slice(-overlap);

      chunkIndex++;
    }

    currentChunk += " " + sentence;
  }


  // ======================================
  // PUSH FINAL CHUNK
  // ======================================

  if (currentChunk.trim()) {

    chunks.push({

      chunk_index: chunkIndex,

      content: currentChunk.trim(),

      word_count:
        currentChunk.trim().split(/\s+/).length
    });
  }


  return chunks;
};


export default chunkText;