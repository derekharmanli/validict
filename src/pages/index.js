import Head from "next/head";
import { useState } from "react";
import {
  Book,
  Lightbulb,
  List,
  Search,
  Settings,
  Plus,
  List as ListIcon,
} from "lucide-react";
import SearchHeader from "../components/search-header";
import WordList from "../components/word-list";
import DictionaryBrowser from "../components/dictionary-browser";
import ConceptBrowser from "../components/concept-browser";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("list"); // "list", "search", "settings"
  const [browseMode, setBrowseMode] = useState("dictionary"); // "dictionary" or "concepts"
  const [selectedLetter, setSelectedLetter] = useState("");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLetter("");
  };

  // Colors for better contrast
  const colors = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-blue-100 text-blue-900",
    accent: "bg-blue-200 hover:bg-blue-300",
    highlight: "bg-yellow-200 text-blue-900",
    muted: "text-blue-500",
    border: "border-blue-200",
    iconActive: "text-blue-600",
    iconInactive: "text-gray-400",
    gradientText:
      "bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text",
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

      <main className="min-h-screen bg-background pb-20">
        {/* Main Content Area */}
        <div className="container mx-auto px-4 pt-6">
          {/* View: My Word List */}
          {activeView === "list" && (
            <div className="space-y-4">
              <h1 className={`text-3xl font-bold ${colors.gradientText}`}>
                My Word List
              </h1>
              <WordList searchTerm={""} cardColors={colors} />
            </div>
          )}

          {/* View: Search/Browse */}
          {activeView === "search" && (
            <div className="space-y-6">
              {/* Search Header */}
              <SearchHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                activeTab={browseMode}
                colors={colors}
              />

              {/* Dictionary/Concept Toggle */}
              <div className="flex rounded-lg overflow-hidden border-2 border-purple-200">
                <button
                  onClick={() => {
                    setBrowseMode("dictionary");
                    resetFilters();
                  }}
                  className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors ${
                    browseMode === "dictionary"
                      ? colors.primary
                      : "bg-white text-[#000] hover:bg-purple-50"
                  }`}
                >
                  <Book className="h-5 w-5" />
                  Dictionary
                </button>
                <button
                  onClick={() => {
                    setBrowseMode("concepts");
                    resetFilters();
                  }}
                  className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 transition-colors ${
                    browseMode === "concepts"
                      ? colors.primary
                      : "bg-white text-[#000] hover:bg-purple-50"
                  }`}
                >
                  <Lightbulb className="h-5 w-5" />
                  Concepts
                </button>
              </div>

              {/* A-Z Filter */}
              <Card className={`rounded-xl shadow-md ${colors.border}`}>
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <button
                      key="all"
                      onClick={() => setSelectedLetter("")}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium transition-all ${
                        !selectedLetter ? colors.primary : colors.accent
                      }`}
                    >
                      All
                    </button>
                    {alphabet.map((letter) => (
                      <button
                        key={letter}
                        onClick={() => setSelectedLetter(letter)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-all ${
                          selectedLetter === letter
                            ? colors.primary
                            : colors.accent
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Display */}
              <div className="mt-4">
                {browseMode === "dictionary" ? (
                  <DictionaryBrowser
                    searchTerm={searchTerm}
                    letterFilter={selectedLetter}
                    colors={colors}
                  />
                ) : (
                  <ConceptBrowser
                    searchTerm={searchTerm}
                    letterFilter={selectedLetter}
                    colors={colors}
                  />
                )}
              </div>
            </div>
          )}

          {/* View: Settings */}
          {activeView === "settings" && (
            <div className="space-y-4">
              <h1 className={`text-3xl font-bold ${colors.gradientText}`}>
                Settings
              </h1>
              <Card className={`rounded-xl shadow-md ${colors.border}`}>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Appearance</h2>
                  {/* Settings content would go here */}
                  <p className="text-gray-500">
                    Setting options will appear here in a future update.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-50">
          <div className="container mx-auto flex justify-around">
            <button
              onClick={() => setActiveView("list")}
              className={`flex flex-col items-center py-3 px-5 relative ${
                activeView === "list" ? colors.muted : "text-gray-400"
              }`}
            >
              {activeView === "list" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
              )}
              <ListIcon className="h-6 w-6" />
              <span className="text-xs mt-1">My Words</span>
            </button>

            <button
              onClick={() => setActiveView("search")}
              className={`flex flex-col items-center py-3 px-5 relative ${
                activeView === "search" ? colors.muted : "text-gray-400"
              }`}
            >
              {activeView === "search" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
              )}
              <Search className="h-6 w-6" />
              <span className="text-xs mt-1">Search</span>
            </button>

            <button
              onClick={() => setActiveView("settings")}
              className={`flex flex-col items-center py-3 px-5 relative ${
                activeView === "settings" ? colors.muted : "text-gray-400"
              }`}
            >
              {activeView === "settings" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
              )}
              <Settings className="h-6 w-6" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
