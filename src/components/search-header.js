"use client";

import { Search, X, BookOpen } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const searchPlaceholders = {
  wordlist: "Search your saved words...",
  dictionary: "Find words in the dictionary...",
  concepts: "Search for concepts and ideas...",
};

export default function SearchHeader({
  searchTerm,
  onSearchChange,
  activeTab,
  colors,
}) {
  return (
    <div className="relative space-y-5">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${colors?.gradientText || "text-purple-600"}`}>
            {activeTab === "dictionary" ? "Dictionary" : "Concepts"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "dictionary" 
              ? "Discover new words and add them to your collection" 
              : "Explore important concepts and knowledge"}
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-purple-600" />
        </div>
      </div>

      {/* Enhanced Search Input */}
      <div className="relative bg-white rounded-xl py-3 px-4 shadow-md border border-purple-100 transition-all focus-within:shadow-lg focus-within:border-purple-300">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-purple-400 mr-3" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholders[activeTab]}
            className="border-none shadow-none p-0 text-base focus-visible:ring-0 placeholder:text-gray-400 flex-1"
          />
          {searchTerm && (
            <button
              className="ml-2 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
