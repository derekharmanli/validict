"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useWordStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";

export default function DictionaryBrowser() {
  const [currentLetter, setCurrentLetter] = useState("a");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);

  const fetchWords = async () => {
    setLoading(true);
    try {
      // Using Datamuse API for word browsing
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${currentLetter}*&max=20&md=d`
      );
      const data = await response.json();

      // Filter and transform the results
      const processedWords = data
        .filter((word) => word.defs && word.defs.length > 0)
        .map((word) => {
          const [partOfSpeech, definition] = word.defs[0].split("\t");
          return {
            word: word.word,
            definition: definition,
            partOfSpeech: partOfSpeech,
            score: word.score, // Word frequency score
          };
        })
        // Sort by word frequency
        .sort((a, b) => b.score - a.score)
        // Take only first 10 words
        .slice(0, 10);

      setWords(processedWords);
    } catch (error) {
      console.error("Error fetching words:", error);
      toast({
        title: "Error",
        description: "Failed to load dictionary words",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [currentLetter]);

  const handleLetterChange = (letter) => {
    setCurrentLetter(letter.toLowerCase());
    setPage(1);
  };

  const handleAddWord = (word) => {
    addWord({
      word: word.word,
      definition: word.definition,
      partOfSpeech: word.partOfSpeech,
      type: "word",
      source: "dictionary",
    });
    toast({
      title: "Word added",
      description: `"${word.word}" has been added to your word bank.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Browse Dictionary</CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
            <Button
              key={letter}
              variant={
                currentLetter === letter.toLowerCase() ? "default" : "outline"
              }
              className="w-8 h-8 p-0"
              onClick={() => handleLetterChange(letter)}
              disabled={loading}
            >
              {letter}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {words.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No words found for this letter
              </p>
            ) : (
              words.map((word) => (
                <div
                  key={word.word}
                  className="flex items-start justify-between border-b pb-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{word.word}</h3>
                      <span className="text-xs text-muted-foreground">
                        {word.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {word.definition}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddWord(word)}
                    title="Add to word bank"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo(0, 0);
                }}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo(0, 0);
                }}
                disabled={words.length < 10 || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
