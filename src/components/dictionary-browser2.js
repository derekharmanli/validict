"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "../lib/store";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import WordCard from "./word-card";
import { browseWords, searchDictionary } from "../lib/dictionary";

export default function DictionaryBrowser({ searchTerm }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showFullCard, setShowFullCard] = useState(false);
  const observerTarget = useRef(null);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);
  const savedWords = useWordStore((state) => state.words);

  // Load words
  useEffect(() => {
    loadInitialWords();
  }, []);

  const loadInitialWords = async () => {
    setLoading(true);
    try {
      const data = await browseWords("", 20);
      setWords(data);
    } catch (error) {
      toast({
        description: "Failed to load dictionary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word) => {
    if (selectedWord?.word === word.word) {
      setShowFullCard(true);
    } else {
      setSelectedWord(word);
      setShowFullCard(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {showFullCard ? (
          <WordCard
            word={selectedWord}
            onClose={() => {
              setShowFullCard(false); // Hide WordCard
              setSelectedWord(null);
            }}
            inDictionary={true}
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
            <AnimatePresence>
              {words.map((word) => {
                const isSelected = selectedWord?.word === word.word;
                const isSaved = savedWords.some(
                  (saved) => saved.word === word.word
                );

                return (
                  <motion.div
                    key={word.word}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
                      p-4 rounded-lg transition-all select-none
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
                        <h3 className="font-medium truncate">{word.word}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {word.definition}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
