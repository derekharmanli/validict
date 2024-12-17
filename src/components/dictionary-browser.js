"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DictionaryBrowser({ searchTerm }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);
  const savedWords = useWordStore((state) => state.words);

  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchPopularWords();
      return;
    }

    const timer = setTimeout(() => {
      searchWords(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPopularWords = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.datamuse.com/words?v=1000");
      const data = await response.json();
      setWords(data.slice(0, 50));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dictionary words",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchWords = async (term) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${term}*&md=d&max=50`
      );
      const data = await response.json();
      setWords(data.filter((word) => word.defs?.length > 0));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search dictionary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word) => {
    if (selectedWord?.word === word.word) {
      const [partOfSpeech, definition] = word.defs[0].split("\t");
      addWord({
        word: word.word,
        definition: definition,
        partOfSpeech: partOfSpeech,
      });
      toast({
        description: `"${word.word}" has been added to your word bank`,
      });
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
    }
  };

  const isWordSaved = (word) => {
    return savedWords.some((saved) => saved.word === word.word);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!loading && words.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {searchTerm
            ? "No words found"
            : "Start typing to search the dictionary"}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {words.map((word) => {
          const [partOfSpeech, definition] = (word.defs?.[0] || "\t").split(
            "\t"
          );
          const isSelected = selectedWord?.word === word.word;
          const isSaved = isWordSaved(word);

          return (
            <motion.div
              key={word.word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                p-4 rounded-lg transition-all
                ${
                  isSaved
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-accent"
                }
                ${isSelected ? "bg-primary/5 shadow-sm" : ""}
              `}
              onClick={() => !isSaved && handleWordClick(word)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-medium truncate">{word.word}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {partOfSpeech}
                    </span>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2"
                      >
                        <p className="text-sm text-muted-foreground">
                          {definition}
                        </p>
                        <p className="text-sm text-primary font-medium">
                          Click again to add to your word bank
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isSaved && (
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                    Saved
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
