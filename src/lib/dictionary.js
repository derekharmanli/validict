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

export async function browseWords(letter) {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${letter}*&max=20&md=d`
    );
    const data = await response.json();
    return data
      .filter((word) => word.defs)
      .map((word) => {
        const [partOfSpeech, definition] = word.defs[0].split("\t");
        return {
          word: word.word,
          definition,
          partOfSpeech,
        };
      });
  } catch (error) {
    console.error("Browse API Error:", error);
    throw error;
  }
}
