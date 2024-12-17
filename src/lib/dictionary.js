const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export async function browseWords(startAfter = "", limit = 20) {
  try {
    // Fetch from wordnet or another properly ordered dictionary source
    const response = await fetch(
      `${API_URL}/browse?after=${startAfter}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch words");

    const data = await response.json();
    return data.map(formatWordData);
  } catch (error) {
    console.error("Dictionary API Error:", error);
    throw error;
  }
}

export async function searchDictionary(word) {
  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(word)}`);
    if (!response.ok) throw new Error("Word not found");

    const data = await response.json();
    return data.map(formatWordData);
  } catch (error) {
    console.error("Dictionary API Error:", error);
    throw error;
  }
}

function formatWordData(entry) {
  const meanings = entry.meanings?.[0] || {};

  return {
    word: entry.word,
    definition: meanings.definitions?.[0]?.definition || "",
    partOfSpeech: meanings.partOfSpeech,
    pronunciation: entry.phonetic,
    examples: meanings.definitions?.[0]?.example
      ? [meanings.definitions[0].example]
      : [],
  };
}
