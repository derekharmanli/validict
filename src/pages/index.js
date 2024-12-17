import Head from "next/head";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import SearchHeader from "../components/search-header";
import WordList from "../components/word-list";
import DictionaryBrowser from "../components/dictionary-browser";
import ConceptBrowser from "../components/concept-browser";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(""); // Manages the search term
  const [activeTab, setActiveTab] = useState("dictionary"); // Default to Dictionary tab

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchTerm(""); // Reset search on tab change
  };

  return (
    <>
      <Head>
        <title>Validict</title>
        <meta
          name="description"
          content="Personal dictionary and word learning app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <SearchHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm} // Propagates the search term
            activeTab={activeTab}
          />

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wordlist">Word List</TabsTrigger>
              <TabsTrigger value="dictionary">Dictionary</TabsTrigger>
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
            </TabsList>

            {/* Word List */}
            <TabsContent value="wordlist">
              <WordList searchTerm={searchTerm} />
            </TabsContent>

            {/* Dictionary Browser */}
            <TabsContent value="dictionary">
              <DictionaryBrowser searchTerm={searchTerm} />
            </TabsContent>

            {/* Concept Browser */}
            <TabsContent value="concepts">
              <ConceptBrowser searchTerm={searchTerm} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
