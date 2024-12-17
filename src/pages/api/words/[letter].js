// This is a simplified example - you should use a proper word list
const wordLists = {
  a: [
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "abroad",
    "absence",
    "absolute",
    "absorb",
    "abstract",
  ],
  b: [
    "baby",
    "back",
    "background",
    "bad",
    "badly",
    "bag",
    "balance",
    "ball",
    "band",
    "bank",
  ],
  // Add more letters...
};

export default function handler(req, res) {
  const { letter } = req.query;

  if (!letter || !wordLists[letter.toLowerCase()]) {
    return res.status(400).json({ error: "Invalid letter" });
  }

  res.status(200).json(wordLists[letter.toLowerCase()]);
}
