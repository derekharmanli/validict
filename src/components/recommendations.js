"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useWordStore } from "../lib/store";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { searchDictionary } from "../lib/dictionary";
import { useToast } from "./ui/use-toast";

export default function Recommendations() {
  const words = useWordStore((state) => state.words);
  const addWord = useWordStore((state) => state.addWord);
  const { toast } = useToast();

  const handleAddRecommendation = async (word) => {
    try {
      const results = await searchDictionary(word);
      if (results.length > 0) {
        addWord(results[0]);
        toast({
          title: "Word added",
          description: `"${results[0].word}" has been added to your word bank.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add word.",
        variant: "destructive",
      });
    }
  };

  const getRecommendations = () => {
    // Simple recommendation algorithm
    const allPartOfSpeech = words.map((w) => w.partOfSpeech).filter(Boolean);
    const mostCommonType = allPartOfSpeech.reduce(
      (a, b) =>
        allPartOfSpeech.filter((v) => v === a).length >=
        allPartOfSpeech.filter((v) => v === b).length
          ? a
          : b,
      null
    );

    return [
      {
        word: "ephemeral",
        reason: "Based on your interests",
      },
      {
        word: "serendipity",
        reason: `Similar to words in your collection`,
      },
      {
        word: "paradigm",
        reason: `Common ${mostCommonType || "word type"}`,
      },
    ];
  };

  const recommendations = getRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-muted-foreground text-center">
            Add more words to get recommendations
          </p>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium">{rec.word}</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddRecommendation(rec.word)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
