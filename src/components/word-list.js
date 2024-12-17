import { useWordStore } from "@/lib/store";
import WordCard from "./word-card";
import { Card, CardContent } from "./ui/card";

export default function WordList() {
  const words = useWordStore((state) => state.words);
  const removeWord = useWordStore((state) => state.removeWord);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">My Words</h2>
      {words.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Your word bank is empty. Search for words to add them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onRemove={() => removeWord(word.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
