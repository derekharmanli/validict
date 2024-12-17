"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

const searchPlaceholders = {
  wordlist: "Search your saved words...",
  dictionary: "Search the dictionary...",
  concepts: "Search for concepts...",
};

export default function SearchHeader({
  searchTerm,
  onSearchChange,
  activeTab,
}) {
  return (
    <div className="relative">
      {/* Header Title */}
      <div className="pb-4 flex items-center gap-4">
        <h1 className="text-2xl font-bold">
          {activeTab === "wordlist"
            ? "Word Bank"
            : activeTab === "dictionary"
            ? "Dictionary"
            : "Concepts"}
        </h1>
        <div className="text-sm text-muted-foreground">
          Searching in:{" "}
          <span className="font-medium capitalize">{activeTab}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)} // Update parent search state
          placeholder={searchPlaceholders[activeTab]} // Dynamic placeholder based on tab
          className="pl-10"
        />
      </div>
    </div>
  );
}
