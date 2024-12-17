const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

const parser = new xml2js.Parser();

async function convertWordNet() {
  try {
    const dataDir = path.join(__dirname, "../src/data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log("Reading XML file...");
    const xmlData = fs.readFileSync(
      path.join(__dirname, "../wordnet.xml"),
      "utf8"
    );

    console.log("Parsing XML...");
    const result = await parser.parseStringPromise(xmlData);

    const lexicon = result.LexicalResource.Lexicon[0];
    const entries = new Map();
    const synsets = new Map();

    // First pass: Process all Synsets
    console.log("Processing Synsets...");
    if (lexicon.Synset) {
      lexicon.Synset.forEach((synset) => {
        // Debug log to see synset structure
        console.log("Synset structure:", JSON.stringify(synset, null, 2));

        synsets.set(synset.$.id, {
          id: synset.$.id,
          definitions: synset.Definition
            ? synset.Definition.map((def) => def)
            : [],
          examples: synset.Example ? synset.Example.map((ex) => ex) : [],
          relations: synset.SynsetRelation
            ? synset.SynsetRelation.map((rel) => ({
                type: rel.$.relType,
                target: rel.$.target,
              }))
            : [],
        });
      });
    }

    // Second pass: Process all Lexical Entries
    console.log("Processing Lexical Entries...");
    if (lexicon.LexicalEntry) {
      lexicon.LexicalEntry.forEach((entry) => {
        const lemma = entry.Lemma[0].$;
        const senses = entry.Sense
          ? entry.Sense.map((sense) => {
              const synset = synsets.get(sense.$.synset);
              return {
                id: sense.$.id,
                synsetId: sense.$.synset,
                definitions: synset ? synset.definitions : [],
                examples: synset ? synset.examples : [],
                relations: sense.SenseRelation
                  ? sense.SenseRelation.map((rel) => ({
                      type: rel.$.relType,
                      target: rel.$.target,
                    }))
                  : [],
              };
            })
          : [];

        entries.set(entry.$.id, {
          id: entry.$.id,
          word: lemma.writtenForm,
          partOfSpeech: lemma.partOfSpeech,
          senses,
          spellings: senses.flatMap((sense) =>
            sense.relations
              .filter((rel) => rel.type.includes("spelling"))
              .map((rel) => rel.type)
          ),
          relations: senses.flatMap((sense) => sense.relations),
        });
      });
    }

    // Convert to array and sort
    console.log("Finalizing dictionary...");
    const dictionary = Array.from(entries.values())
      .sort((a, b) => a.word.localeCompare(b.word))
      .filter(
        (entry, index, self) =>
          index === self.findIndex((e) => e.word === entry.word)
      );

    // Write a sample entry to debug
    console.log("Sample entry:", JSON.stringify(dictionary[0], null, 2));

    // Write to JSON
    console.log("Writing dictionary to file...");
    fs.writeFileSync(
      path.join(dataDir, "dictionary.json"),
      JSON.stringify(dictionary, null, 2)
    );

    console.log(`Processed ${dictionary.length} words`);
    console.log("Dictionary stats:");
    console.log(`Total words: ${dictionary.length}`);
    console.log(
      `Words with multiple senses: ${
        dictionary.filter((entry) => entry.senses.length > 1).length
      }`
    );
  } catch (error) {
    console.error("Error processing WordNet:", error);
  }
}

convertWordNet();
