import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useWordStore } from "../lib/store";
import { searchDictionary } from "../lib/dictionary";
import { useToast } from "../components/ui/use-toast";

export default function SearchHeader() {
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const addWord = useWordStore((state) => state.addWord);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const results = await searchDictionary(query);
      if (results.length > 0) {
        addWord(results[0]);
        toast({
          title: "Word found",
          description: `"${results[0].word}" has been added to your word bank.`,
        });
        setQuery("");
      } else {
        toast({
          title: "No results",
          description: "No definition found for this word.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search the dictionary.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Word Bank</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          placeholder="Search for a word..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-lg"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
}
