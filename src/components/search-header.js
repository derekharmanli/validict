"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useWordStore } from "@/lib/store";
import { searchDictionary } from "@/lib/dictionary";
import debounce from "lodash/debounce";

export default function SearchHeader() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const addWord = useWordStore((state) => state.addWord);

  const debouncedSearch = debounce(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchDictionary(searchTerm);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query]);

  return (
    <div className="sticky top-0 bg-background z-10 pb-4">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for a word..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        {results.length > 0 && query && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-auto">
            {results.map((result) => (
              <Button
                key={result.word}
                variant="ghost"
                onClick={() => {
                  addWord(result);
                  setQuery("");
                  setResults([]);
                }}
                className="w-full px-4 py-2 text-left hover:bg-accent flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{result.word}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {result.definition}
                  </div>
                </div>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
