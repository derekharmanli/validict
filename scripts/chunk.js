const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 1000; // Words per chunk

function chunkDictionary() {
  console.log("Reading dictionary...");
  const dictionary = require("../src/data/dictionary.json");

  // Create chunks directory
  const chunksDir = path.join(__dirname, "../public/dictionary-chunks");
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  console.log("Creating chunks...");
  // Split into chunks
  for (let i = 0; i < dictionary.length; i += CHUNK_SIZE) {
    const chunk = dictionary.slice(i, i + CHUNK_SIZE);
    const chunkNum = Math.floor(i / CHUNK_SIZE);

    fs.writeFileSync(
      path.join(chunksDir, `chunk-${chunkNum}.json`),
      JSON.stringify(chunk)
    );
  }

  // Create index file with first word of each chunk
  const index = dictionary
    .filter((_, i) => i % CHUNK_SIZE === 0)
    .map((entry, i) => ({
      firstWord: entry.word,
      chunk: i,
    }));

  fs.writeFileSync(path.join(chunksDir, "index.json"), JSON.stringify(index));

  console.log(`Created ${Math.ceil(dictionary.length / CHUNK_SIZE)} chunks`);
}

chunkDictionary();
