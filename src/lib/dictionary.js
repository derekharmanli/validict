let dictionaryIndex = null;
let loadedChunks = new Map();

async function loadIndex() {
  if (!dictionaryIndex) {
    const response = await fetch("/dictionary-chunks/index.json");
    dictionaryIndex = await response.json();
  }
  return dictionaryIndex;
}

async function loadChunk(chunkNum) {
  if (!loadedChunks.has(chunkNum)) {
    const response = await fetch(`/dictionary-chunks/chunk-${chunkNum}.json`);
    const chunk = await response.json();
    loadedChunks.set(chunkNum, chunk);

    // Keep only last 5 chunks in memory
    if (loadedChunks.size > 5) {
      const firstKey = loadedChunks.keys().next().value;
      loadedChunks.delete(firstKey);
    }
  }
  return loadedChunks.get(chunkNum);
}

export async function browseWords(startAfter = "", limit = 50) {
  const index = await loadIndex();

  // Find the right chunk
  let chunkNum = 0;
  if (startAfter) {
    chunkNum = index.findIndex((entry) => entry.firstWord > startAfter) - 1;
    if (chunkNum < 0) chunkNum = 0;
  }

  const chunk = await loadChunk(chunkNum);
  let startIndex = 0;

  if (startAfter) {
    startIndex = chunk.findIndex((entry) => entry.word > startAfter);
    if (startIndex < 0) startIndex = 0;
  }

  let words = chunk.slice(startIndex, startIndex + limit);

  // If we need more words and there are more chunks
  if (words.length < limit && chunkNum < index.length - 1) {
    const nextChunk = await loadChunk(chunkNum + 1);
    words = [...words, ...nextChunk.slice(0, limit - words.length)];
  }

  return words;
}

export async function searchDictionary(query) {
  query = query.toLowerCase();
  const words = [];
  const index = await loadIndex();

  // Search through chunks until we find enough matches
  for (let i = 0; i < index.length && words.length < 50; i++) {
    const chunk = await loadChunk(i);
    const matches = chunk.filter(
      (entry) =>
        entry.word.toLowerCase().includes(query) ||
        entry.senses.some((sense) =>
          sense.definitions.some((def) => def?.toLowerCase().includes(query))
        )
    );
    words.push(...matches.slice(0, 50 - words.length));
  }

  return words;
}
