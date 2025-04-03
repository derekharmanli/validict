"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "../lib/store";
import { Loader2, Plus, Check, X, Book } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { browseWords, searchDictionary } from "../lib/dictionary";

export default function DictionaryBrowser({
  searchTerm,
  letterFilter,
  colors,
}) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastWord, setLastWord] = useState("");
  const [selectedWord, setSelectedWord] = useState(null); // To show details
  const observerTarget = useRef(null);
  const longPressTimer = useRef(null);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);
  const savedWords = useWordStore((state) => state.words);

  // Load words initially or when searchTerm/letterFilter changes
  useEffect(() => {
    loadWords();
  }, [searchTerm, letterFilter]);

  const loadWords = async () => {
    setLoading(true);
    try {
      let data;
      if (searchTerm) {
        data = await searchDictionary(searchTerm);
      } else if (letterFilter) {
        data = await browseWords(letterFilter.toLowerCase(), 30);
        // Filter to only include words starting with this letter
        data = data.filter((word) =>
          word.word.toLowerCase().startsWith(letterFilter.toLowerCase())
        );
      } else {
        data = await browseWords("", 20);
      }

      // Process definitions for display
      data = data.map((word) => {
        let definition = "No definition available";

        // Try to get definition from senses
        if (word.senses && word.senses.length > 0) {
          const definitions = [];
          word.senses.forEach((sense) => {
            if (sense.definitions && sense.definitions.length > 0) {
              definitions.push(...sense.definitions);
            }
          });

          if (definitions.length > 0) {
            definition = definitions[0];
          }
        }

        return {
          ...word,
          definition,
        };
      });

      setWords(data);
      setLastWord(data[data.length - 1]?.word || "");
    } catch (error) {
      toast({
        description: "Failed to load dictionary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          !searchTerm &&
          !letterFilter
        ) {
          loadMoreWords();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadingMore, searchTerm, letterFilter, lastWord]);

  const loadMoreWords = async () => {
    if (loadingMore || !lastWord) return;
    setLoadingMore(true);

    try {
      const newWords = await browseWords(lastWord, 20);
      if (newWords.length > 0) {
        // Process definitions for display
        const processedWords = newWords.map((word) => {
          let definition = "No definition available";

          // Try to get definition from senses
          if (word.senses && word.senses.length > 0) {
            const definitions = [];
            word.senses.forEach((sense) => {
              if (sense.definitions && sense.definitions.length > 0) {
                definitions.push(...sense.definitions);
              }
            });

            if (definitions.length > 0) {
              definition = definitions[0];
            }
          }

          return {
            ...word,
            definition,
          };
        });

        setWords((prev) => [...prev, ...processedWords]);
        setLastWord(newWords[newWords.length - 1]?.word || "");
      }
    } catch (error) {
      toast({
        description: "Failed to load more words",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddWord = (word) => {
    addWord({
      word: word.word,
      definition: word.definition,
      partOfSpeech: word.partOfSpeech,
      senses: word.senses || [],
      dateAdded: new Date().toISOString(),
    });
    toast({
      description: `"${word.word}" has been added to your word bank`,
    });
  };

  // Format the part of speech for display
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
    <div>
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  {selectedWord.word}
                </h2>
                {selectedWord.partOfSpeech && (
                  <div className="text-sm text-blue-600 mt-1">
                    {getPartOfSpeechDisplay(selectedWord.partOfSpeech)}
                  </div>
                )}
              </div>

              <button
                className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                onClick={() => setSelectedWord(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedWord.senses && selectedWord.senses.length > 0 ? (
                selectedWord.senses.map((sense, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4">
                    <div className="mb-2">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        Definition{" "}
                        {selectedWord.senses.length > 1 ? index + 1 : ""}
                      </span>
                    </div>

                    {sense.definitions &&
                      sense.definitions.map((def, i) => (
                        <p key={i} className="text-gray-700 mb-2">
                          {def}
                        </p>
                      ))}

                    {sense.examples && sense.examples.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-blue-200">
                        <p className="text-sm text-gray-500 mb-1 font-medium">
                          Example:
                        </p>
                        <p className="text-sm italic text-gray-500">
                          "{sense.examples[0]}"
                        </p>
                      </div>
                    )}

                    {sense.relations && sense.relations.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">
                          Related concepts:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {sense.relations.slice(0, 5).map((rel, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {rel.word || rel}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="pb-4">
                  <p className="text-gray-700">
                    {selectedWord.definition || "No definition available"}
                  </p>
                </div>
              )}

              {selectedWord.spellings && selectedWord.spellings.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Alternative spellings:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.spellings.map((spelling, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {spelling}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!savedWords.some(
                (saved) => saved.word === selectedWord.word
              ) && (
                <button
                  onClick={() => {
                    handleAddWord(selectedWord);
                    setSelectedWord(null);
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                >
                  Add to My Words
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-blue-400 mb-4" />
          <p className="text-gray-500">Loading dictionary...</p>
        </div>
      ) : words.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
            <Book className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : letterFilter
              ? `No words found for letter "${letterFilter}"`
              : "No dictionary entries available"}
          </h3>
          <p className="text-gray-500 text-sm">
            Try a different search term or browse by different letters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {words.map((word) => {
            const isSaved = savedWords.some(
              (saved) => saved.word === word.word
            );

            return (
              <div
                key={word.word}
                className="bg-white rounded-xl shadow-sm p-4 border border-blue-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedWord(word)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-[#000] text-lg">
                      {word.word}
                    </h3>
                    {word.partOfSpeech && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {getPartOfSpeechDisplay(word.partOfSpeech)}
                      </span>
                    )}
                  </div>

                  <button
                    className={`p-2 rounded-full ${
                      isSaved
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      !isSaved && handleAddWord(word);
                    }}
                    disabled={isSaved}
                  >
                    {isSaved ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="text-gray-600 line-clamp-2 min-h-[3em]">
                  {word.definition}
                </p>

                <div className="flex justify-end mt-3">
                  <span className="text-sm text-blue-500">Tap for details</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      {!searchTerm && !letterFilter && (
        <div
          ref={observerTarget}
          className="h-16 flex justify-center items-center mt-6"
        >
          {loadingMore && (
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-400 mr-3" />
              <span className="text-gray-500">Loading more words...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
