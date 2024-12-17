"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { useWordStore } from "../lib/store";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ConceptBrowser({ searchTerm }) {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);
  const savedWords = useWordStore((state) => state.words);

  useEffect(() => {
    if (!searchTerm.trim()) {
      // Show some popular concepts when no search term
      setConcepts([
        {
          title: "Occam's Razor",
          description: "The simplest explanation is usually the correct one",
        },
        {
          title: "Dunning-Kruger Effect",
          description:
            "When people overestimate their ability due to limited knowledge",
        },
        {
          title: "Overton Window",
          description: "Range of ideas acceptable in public discourse",
        },
        // Add more default concepts here
      ]);
      return;
    }

    const timer = setTimeout(() => {
      searchConcepts(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        definition: concept.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!loading && concepts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {searchTerm
            ? "No concepts found"
            : "Search for concepts or browse popular ones"}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {concepts.map((concept) => {
          const isSelected = selectedConcept?.pageid === concept.pageid;
          const isSaved = isConceptSaved(concept);

          return (
            <motion.div
              key={concept.pageid || concept.title}
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
              onClick={() => !isSaved && handleConceptClick(concept)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-medium truncate">{concept.title}</h3>
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
                          {concept.snippet?.replace(/<\/?[^>]+(>|$)/g, "") ||
                            concept.description}
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
