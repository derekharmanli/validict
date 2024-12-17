"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { useWordStore } from "@/lib/store";
import { Plus, ExternalLink } from "lucide-react";

const POPULAR_CONCEPTS = [
  { name: "Overton Window", category: "Politics" },
  { name: "Hanlon's Razor", category: "Philosophy" },
  { name: "Dunning-Kruger Effect", category: "Psychology" },
  { name: "Streisand Effect", category: "Social" },
  { name: "Occam's Razor", category: "Philosophy" },
  { name: "Murphy's Law", category: "Culture" },
  { name: "Peter Principle", category: "Business" },
  { name: "Parkinson's Law", category: "Business" },
];

export default function ConceptBrowser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);

  const searchWikipedia = async (query) => {
    try {
      // Search for the concept
      const searchUrl =
        `https://en.wikipedia.org/w/api.php?` +
        `action=query&` +
        `list=search&` +
        `srsearch=${encodeURIComponent(query)}&` +
        `format=json&` +
        `origin=*`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      const pageId = searchData.query.search[0]?.pageid;

      if (!pageId) {
        throw new Error("Concept not found");
      }

      // Get the full content
      const contentUrl =
        `https://en.wikipedia.org/w/api.php?` +
        `action=query&` +
        `prop=extracts|categories&` +
        `exintro=1&` +
        `explaintext=1&` +
        `pageids=${pageId}&` +
        `format=json&` +
        `origin=*`;

      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();
      const page = contentData.query.pages[pageId];

      return {
        type: "concept",
        id: pageId.toString(),
        word: page.title,
        definition: page.extract,
        source: "Wikipedia",
        url: `https://en.wikipedia.org/?curid=${pageId}`,
        categories:
          page.categories?.map((cat) => cat.title.replace("Category:", "")) ||
          [],
      };
    } catch (error) {
      console.error("Wikipedia API Error:", error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const concept = await searchWikipedia(searchTerm);
      addWord(concept);
      toast({
        title: "Concept added",
        description: `"${concept.word}" has been added to your collection.`,
      });
      setSearchTerm("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Concept not found or error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (conceptName) => {
    setSearchTerm(conceptName);
    try {
      setLoading(true);
      const concept = await searchWikipedia(conceptName);
      addWord(concept);
      toast({
        title: "Concept added",
        description: `"${concept.word}" has been added to your collection.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add concept.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Browse Concepts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a concept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Popular Concepts:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {POPULAR_CONCEPTS.map((concept) => (
              <Button
                key={concept.name}
                variant="outline"
                className="justify-start"
                disabled={loading}
                onClick={() => handleQuickAdd(concept.name)}
              >
                <span className="truncate">{concept.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(POPULAR_CONCEPTS.map((c) => c.category))).map(
              (category) => (
                <Button
                  key={category}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  {category}
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
