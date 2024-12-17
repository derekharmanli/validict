"use client";

import { useWordStore } from "../lib/store";
import WordCard from "./word-card";
import { Card, CardContent } from "./ui/card";

export default function WordList({ searchTerm }) {
  const words = useWordStore((state) => state.words);

  const filteredWords = words.filter(
    (word) =>
      !searchTerm ||
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredWords.length === 0 ? (
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
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </div>
  );
}
