"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "../lib/store";
import { Loader2, Lightbulb, Plus, X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ConceptBrowser({ searchTerm, letterFilter }) {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);
  const savedWords = useWordStore((state) => state.words);

  const defaultConcepts = {
    A: [
      {
        title: "Anchoring Bias",
        description:
          "Tendency to rely too heavily on the first piece of information offered",
      },
      {
        title: "Availability Heuristic",
        description:
          "Mental shortcut that relies on immediate examples that come to mind",
      },
    ],
    // ... other letters
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        searchConcepts(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    } else if (letterFilter) {
      setConcepts(
        (defaultConcepts[letterFilter] || []).map((concept) => ({
          ...concept,
          pageid: concept.title,
        }))
      );
      setLoading(false);
    } else {
      const allConcepts = Object.values(defaultConcepts).flat();
      setConcepts(
        allConcepts.map((concept) => ({
          ...concept,
          pageid: concept.title,
        }))
      );
      setLoading(false);
    }
  }, [searchTerm, letterFilter]);

  const searchConcepts = async (term) => {
    setLoading(true);
    try {
      const searchUrl =
        `https://en.wikipedia.org/w/api.php?` +
        `action=query&` +
        `list=search&` +
        `srsearch=${encodeURIComponent(term)}&` +
        `format=json&` +
        `origin=*`;

      const response = await fetch(searchUrl);
      const data = await response.json();
      setConcepts(data.query.search);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search concepts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConceptClick = async (concept) => {
    if (selectedConcept?.pageid === concept.pageid) {
      addWord({
        word: concept.title,
        definition:
          concept.snippet?.replace(/<\/?[^>]+(>|$)/g, "") ||
          concept.description,
        type: "concept",
        source: "Wikipedia",
        url: `https://en.wikipedia.org/?curid=${concept.pageid}`,
      });
      toast({
        description: `"${concept.title}" has been added to your word bank`,
      });
      setSelectedConcept(null);
    } else {
      setSelectedConcept(concept);
    }
  };

  const isConceptSaved = (concept) => {
    return savedWords.some((saved) => saved.word === concept.title);
  };

  const handleModalClose = () => {
    setSelectedConcept(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-purple-400 mb-4" />
        <p className="text-gray-500">Loading concepts...</p>
      </div>
    );
  }

  if (!loading && concepts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
          <Lightbulb className="h-8 w-8 text-purple-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {searchTerm
            ? `No concepts found for "${searchTerm}"`
            : letterFilter
            ? `No concepts found for letter "${letterFilter}"`
            : "No concepts available"}
        </h3>
        <p className="text-gray-500 text-sm">
          Try a different search term or browse other categories.
        </p>
      </div>
    );
  }

  return (
    <div>
      {selectedConcept && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleModalClose}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-blue-900">
                {selectedConcept.title}
              </h2>
              <button
                className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                onClick={handleModalClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-2">
              {selectedConcept.snippet?.replace(/<\/?[^>]+(>|$)/g, "") ||
                selectedConcept.description}
            </p>
            {selectedConcept.url && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium mb-2">References:</h3>
                <a
                  href={selectedConcept.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Read more on Wikipedia
                </a>
              </div>
            )}
            {!isConceptSaved(selectedConcept) && (
              <button
                onClick={() => {
                  handleConceptClick(selectedConcept);
                  handleModalClose();
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Add to My Words
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {concepts.map((concept) => {
            const isSaved = isConceptSaved(concept);
            const description =
              concept.snippet?.replace(/<\/?[^>]+(>|$)/g, "") ||
              concept.description;

            return (
              <motion.div
                key={concept.pageid || concept.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                  bg-white rounded-xl shadow-sm p-4 transition-all border border-blue-100
                  ${isSaved ? "opacity-70" : "hover:shadow-md cursor-pointer"}
                `}
                onClick={() => !isSaved && setSelectedConcept(concept)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-[#000] text-lg">
                    {concept.title}
                  </h3>
                  {isSaved ? (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      Saved
                    </span>
                  ) : (
                    <button
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConceptClick(concept);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 line-clamp-3">{description}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
