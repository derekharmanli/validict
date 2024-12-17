"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { useWordStore } from "../lib/store";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function WordCard({ word, onClose, inDictionary = false }) {
  const { addWord } = useWordStore();

  console.log("Word data:", word); // Debug log for incoming data

  const handleAddWord = () => {
    addWord({
      id: word.id,
      word: word.word,
      partOfSpeech: word.partOfSpeech,
      senses: word.senses || [],
      dateAdded: new Date().toISOString(),
    });
  };

  const senses = Array.isArray(word.senses) ? word.senses : [];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl">
                {word.word || "Unknown Word"}
              </DialogTitle>
              <Badge variant="outline" className="text-xs">
                {getPartOfSpeech(word.partOfSpeech)}
              </Badge>
            </div>
            {!inDictionary && (
              <Button variant="outline" size="icon" onClick={handleAddWord}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {senses.length > 0 ? (
            senses.map((sense, index) => (
              <div key={sense?.id || index} className="space-y-3">
                <h3 className="font-medium">
                  Definition {senses.length > 1 ? index + 1 : ""}
                </h3>

                {sense?.definitions?.length > 0 ? (
                  sense.definitions.map((def, defIndex) => (
                    <p key={defIndex} className="text-muted-foreground">
                      {def}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No definition provided.
                  </p>
                )}

                {Array.isArray(sense?.examples) &&
                  sense.examples.length > 0 && (
                    <div className="pl-4 border-l-2">
                      <p className="text-sm font-medium mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {sense.examples.map((example, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No definitions available</p>
          )}

          {Array.isArray(word.spellings) && word.spellings.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Variants:</h3>
              <div className="flex flex-wrap gap-2">
                {word.spellings.map((spelling, i) => (
                  <Badge key={i} variant="outline">
                    {spelling}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getPartOfSpeech(pos) {
  switch (pos) {
    case "n":
      return "Noun";
    case "v":
      return "Verb";
    case "a":
      return "Adjective";
    case "r":
      return "Adverb";
    default:
      return pos || "Unknown";
  }
}
