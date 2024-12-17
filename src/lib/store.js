import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWordStore = create(
  persist(
    (set) => ({
      words: [],

      addWord: (word) =>
        set((state) => {
          if (state.words.some((w) => w.word === word.word)) {
            return state;
          }

          const newWord = {
            id: word.id || crypto.randomUUID(),
            type: word.type || "word",
            word: word.word,
            definition: word.definition,
            pronunciation: word.pronunciation,
            examples: word.examples,
            partOfSpeech: word.partOfSpeech,
            categories: word.categories,
            source: word.source,
            url: word.url,
            tags: [],
            dateAdded: new Date().toISOString(),
          };

          return { words: [...state.words, newWord] };
        }),

      removeWord: (id) =>
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
        })),

      addTag: (id, tag) =>
        set((state) => ({
          words: state.words.map((word) =>
            word.id === id
              ? { ...word, tags: [...(word.tags || []), tag] }
              : word
          ),
        })),

      removeTag: (id, tag) =>
        set((state) => ({
          words: state.words.map((word) =>
            word.id === id
              ? { ...word, tags: word.tags.filter((t) => t !== tag) }
              : word
          ),
        })),

      markReviewed: (id) =>
        set((state) => ({
          words: state.words.map((word) =>
            word.id === id
              ? { ...word, lastReviewed: new Date().toISOString() }
              : word
          ),
        })),
    }),
    {
      name: "word-bank-storage",
    }
  )
);

export { useWordStore };
