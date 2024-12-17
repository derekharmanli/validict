import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useWordStore } from "../lib/store";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { browseWords } from "../lib/dictionary";

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
      const data = await browseWords(currentLetter);
      setWords(data);
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
            >
              {letter}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {words.map((word) => (
              <div
                key={word.word}
                className="flex items-start justify-between border-b pb-2"
              >
                <div>
                  <h3 className="font-medium">{word.word}</h3>
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
            ))}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={words.length < 20}
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
