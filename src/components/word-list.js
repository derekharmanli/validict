"use client";

import { useState } from "react";
import WordCard from "./word-card";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "../lib/store";

export default function WordList({ searchTerm }) {
  const [selectedWord, setSelectedWord] = useState(null); // State to control WordCard visibility
  const words = useWordStore((state) => state.words);

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
          onClose={() => setSelectedWord(null)} // Hide WordCard
        />
      ) : filteredWords.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {searchTerm
              ? "No matching words found in your word bank"
              : "Your word bank is empty. Add words from the dictionary!"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              onClick={() => setSelectedWord(word)} // Open WordCard on click
              className="cursor-pointer hover:bg-accent p-2 rounded transition-all"
            >
              <h3 className="font-medium">{word.word}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {word.definition}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
