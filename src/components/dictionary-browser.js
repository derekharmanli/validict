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
  const [currentLetter, setCurrentLetter] = useState("a");
  const [selectedWord, setSelectedWord] = useState(null);
  const [showFullCard, setShowFullCard] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastWord, setLastWord] = useState("");
  const observerTarget = useRef(null);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);
  const savedWords = useWordStore((state) => state.words);

  const fetchWords = async (letter) => {
    setLoading(true);
    try {
      const data = await browseWords(letter);
      setWords(data);
      setLastWord(data[data.length - 1]?.word || "");
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

  useEffect(() => {
    if (!searchTerm) {
      fetchWords(currentLetter);
    }
  }, [currentLetter, searchTerm]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm) return;

    const searchWord = async () => {
      setLoading(true);
      try {
        const results = await searchDictionary(searchTerm);
        setWords(results);
      } catch (error) {
        setWords([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchWord, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMoreWords = async () => {
    if (loadingMore || !lastWord) return;

    setLoadingMore(true);
    try {
      const newWords = await browseWords(lastWord, 20);
      setWords((prev) => [...prev, ...newWords]);
      setLastWord(newWords[newWords.length - 1]?.word || "");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more words",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
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

  const handleWordMouseDown = (word) => {
    longPressTimer.current = setTimeout(() => {
      const [partOfSpeech, definition] = word.defs[0].split("\t");
      addWord({
        word: word.word,
        definition: definition,
        partOfSpeech: partOfSpeech,
      });
      toast({
        description: `"${word.word}" has been added to your word bank`,
      });
    }, 500);
  };

  const handleWordMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
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
              setShowFullCard(false);
              setSelectedWord(null);
            }}
            onLongPress={() => {
              const [partOfSpeech, definition] =
                selectedWord.defs[0].split("\t");
              addWord({
                word: selectedWord.word,
                definition: definition,
                partOfSpeech: partOfSpeech,
              });
            }}
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
            <AnimatePresence>
              {words.map((word) => {
                const [partOfSpeech, definition] = word.defs[0].split("\t");
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
                    onMouseDown={() => !isSaved && handleWordMouseDown(word)}
                    onMouseUp={handleWordMouseUp}
                    onMouseLeave={handleWordMouseUp}
                    onTouchStart={() => !isSaved && handleWordMouseDown(word)}
                    onTouchEnd={handleWordMouseUp}
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
                                Click again to view full details, or hold to add
                                to word bank
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Infinite scroll trigger */}
            {!searchTerm && (
              <div
                ref={observerTarget}
                className="h-4 flex justify-center items-center"
              >
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
