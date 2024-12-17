"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

const searchPlaceholders = {
  wordbank: "Search your saved words...",
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
      <div className="pb-4 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Word Bank</h1>
        <div className="text-sm text-muted-foreground">
          Searching in:{" "}
          <span className="font-medium capitalize">{activeTab}</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholders[activeTab]}
          className="pl-10"
        />
      </div>
    </div>
  );
}
