"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Tag, Clock, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useWordStore } from "../lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function WordCard({
  word,
  onClose,
  onRemove,
  inDictionary = false,
}) {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const { addTag, removeTag, markReviewed, removeWord } = useWordStore();

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTag(word.id, newTag.trim());
      setNewTag("");
      setIsTagDialogOpen(false);
    }
  };

  const handleRemove = () => {
    if (inDictionary) {
      onClose?.();
    } else {
      removeWord(word.id);
      onRemove?.();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{word.word}</CardTitle>
            {word.type === "concept" && (
              <Badge variant="secondary">{word.source}</Badge>
            )}
          </div>
          {word.pronunciation && (
            <p className="text-sm text-muted-foreground">
              {word.pronunciation}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {word.url && (
            <a
              href={word.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="ghost" size="icon" title="View source">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          {!inDictionary && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => markReviewed(word.id)}
                title="Mark as reviewed"
              >
                <Clock className="h-4 w-4" />
              </Button>
              <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="Add tag">
                    <Tag className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Tag</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddTag} className="space-y-4">
                    <Input
                      placeholder="Enter tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                    <Button type="submit">Add Tag</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            title={inDictionary ? "Close" : "Remove word"}
          >
            {inDictionary ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>{word.definition}</p>
        {word.examples?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm mb-2">Examples:</p>
            <ul className="list-disc list-inside space-y-1">
              {word.examples.map((example, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!inDictionary && (
          <>
            {word.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {word.categories.map((category) => (
                  <Badge key={category} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
            {word.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {word.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(word.id, tag)}
                  >
                    {tag}
                    <span className="sr-only">Remove tag</span>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>
                Added {formatDistanceToNow(new Date(word.dateAdded))} ago
              </span>
              {word.lastReviewed && (
                <span>
                  Last reviewed{" "}
                  {formatDistanceToNow(new Date(word.lastReviewed))} ago
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
