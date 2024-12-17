const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export async function searchDictionary(word) {
  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(word)}`);

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    return data.map((entry) => ({
      word: entry.word,
      definition: entry.meanings[0]?.definitions[0]?.definition || "",
      pronunciation: entry.phonetic,
      examples: entry.meanings[0]?.definitions[0]?.examples || [],
      partOfSpeech: entry.meanings[0]?.partOfSpeech,
    }));
  } catch (error) {
    console.error("Dictionary API Error:", error);
    throw error;
  }
}

// Get a list of words starting with a letter
export async function browseWords(letter) {
  try {
    // Use a predefined word list for each letter
    const response = await fetch(`/api/words/${letter}`);
    if (!response.ok) {
      throw new Error("Failed to fetch words");
    }
    const words = await response.json();

    // Get detailed info for first 10 words
    const detailedWords = await Promise.all(
      words.slice(0, 10).map((word) => searchDictionary(word))
    );

    return detailedWords;
  } catch (error) {
    console.error("Browse API Error:", error);
    throw error;
  }
}
