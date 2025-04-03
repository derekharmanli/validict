"use client";

import { useState } from "react";
import WordCard from "./word-card";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "../lib/store";
import { List as ListIcon } from "lucide-react";

export default function WordList({ searchTerm, cardColors }) {
  const [selectedWord, setSelectedWord] = useState(null); // State to control WordCard visibility
  const words = useWordStore((state) => state.words);

  // Group words by first letter
  const groupedWords = words.reduce((acc, word) => {
    const firstLetter = word.word.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(word);
    return acc;
  }, {});

  // Sort groups alphabetically
  const sortedGroups = Object.keys(groupedWords).sort();

  const filteredWords = words.filter(
    (word) =>
      !searchTerm ||
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {selectedWord ? (
        <WordCard
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          colors={cardColors}
        />
      ) : filteredWords.length === 0 ? (
        <div className="p-6 text-center rounded-xl shadow-md border-2 border-purple-100">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListIcon className="h-10 w-10 text-purple-300" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Your word bank is empty
          </h3>
          <p className="text-sm text-gray-500">
            {searchTerm
              ? "No matching words found"
              : "Go to Search to find and add new words to your collection!"}
          </p>
        </div>
      ) : searchTerm ? (
        // Show flat list when searching
        <div className="space-y-3">
          {filteredWords.map((word) => (
            <WordCard_Compact
              key={word.id || word.word}
              word={word}
              onClick={() => setSelectedWord(word)}
              colors={cardColors}
            />
          ))}
        </div>
      ) : (
        // Show alphabetically grouped list
        <div className="space-y-6">
          {sortedGroups.map((letter) => (
            <div key={letter} className="space-y-3">
              <div className="sticky top-0 bg-background py-2 z-10">
                <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-100 pb-1">
                  {letter}
                </h2>
              </div>
              {groupedWords[letter].map((word) => (
                <WordCard_Compact
                  key={word.id || word.word}
                  word={word}
                  onClick={() => setSelectedWord(word)}
                  colors={cardColors}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact word card component to use in the list view
function WordCard_Compact({ word, onClick, colors }) {
  // Format the word definition to display clearly
  let definition = word.definition || "No definition available";
  if (definition.length > 120) {
    definition = definition.substring(0, 117) + "...";
  }

  // Format the part of speech display
  const getPartOfSpeechDisplay = (pos) => {
    switch (pos) {
      case "n":
        return "noun";
      case "v":
        return "verb";
      case "a":
        return "adjective";
      case "r":
        return "adverb";
      default:
        return pos;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg border-l-4 border-blue-400 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg text-[#000] font-semibold">{word.word}</h3>
        {word.partOfSpeech && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {getPartOfSpeechDisplay(word.partOfSpeech)}
          </span>
        )}
      </div>

      <p className="text-gray-600 mt-2">{definition}</p>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        {word.dateAdded && (
          <div>Added: {new Date(word.dateAdded).toLocaleDateString()}</div>
        )}
        <div className="text-purple-500">Tap for details</div>
      </div>
    </div>
  );
}
