"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tag, Star, Clock, ArrowLeft, ArrowUpRight } from "lucide-react";

export default function WordView({ word, onBack }) {
  const [relatedWords, setRelatedWords] = useState({
    synonyms: [],
    antonyms: [],
    rhymes: [],
    related: [],
  });

  useEffect(() => {
    // Fetch related words from DataMuse API
    async function fetchRelated() {
      const [synonyms, antonyms, rhymes] = await Promise.all([
        fetch(`https://api.datamuse.com/words?rel_syn=${word.word}`),
        fetch(`https://api.datamuse.com/words?rel_ant=${word.word}`),
        fetch(`https://api.datamuse.com/words?rel_rhy=${word.word}`),
      ]);

      setRelatedWords({
        synonyms: await synonyms.json(),
        antonyms: await antonyms.json(),
        rhymes: await rhymes.json(),
        related: [], // Add more relationships as needed
      });
    }

    fetchRelated();
  }, [word.word]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Word Bank
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Favorite
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Review
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{word.word}</h1>
          {word.pronunciation && (
            <p className="text-muted-foreground">{word.pronunciation}</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Definition</h2>
          <p>{word.definition}</p>
        </div>

        {word.examples?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Examples</h2>
            <ul className="list-disc list-inside space-y-2">
              {word.examples.map((example, i) => (
                <li key={i} className="text-muted-foreground">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(relatedWords).map(
            ([type, words]) =>
              words.length > 0 && (
                <div key={type}>
                  <h2 className="text-lg font-semibold mb-2 capitalize">
                    {type}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {words.slice(0, 5).map((w) => (
                      <Badge key={w.word} variant="secondary">
                        {w.word}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>

        {word.tags?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {word.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Added {new Date(word.dateAdded).toLocaleDateString()}
            {word.lastReviewed &&
              ` • Last reviewed ${new Date(
                word.lastReviewed
              ).toLocaleDateString()}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
