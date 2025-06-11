import { useState } from "react";
import { Search, List, Grid2x2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const techOptions = ["Digital", "Physical", "Virtual Reality (XR)", "Hybrid"];
const ageOptions = ["Children", "Adults"];
const purposeOptions = [
  "Pedagogy",
  "Persuasion",
  "Participation",
  "Pedagogy & Persuasion",
  "Pedagogy & Participation",
  "Persuasion & Participation",
  "All",
];

const audienceOptions = ["General Public", "Students", "Business Professionals"];

const playerModeOptions = ["Single Player", "Multi Player", "Both"];

// Category options exactly as they appear in the JSON data
const categoryOptions = [
  "General Sustainable Development",
  "Urban Development and Planning",
  "Energy Efficiency and Transition", 
  "Natural Hazards and Extreme Events",
  "Water Management",
  "Waste and Resource Management",
  "Sustainable Community Engagement",
  "Construction and Design",
];

// Direct mapping for exact matches from JSON to filter categories
export const categoryMapping: Record<string, string> = {
  "Urban Development and Planning": "Urban Development and Planning",
  "Energy Efficiency and Transition": "Energy Efficiency and Transition",
  "Natural Hazards and Extreme Events": "Natural Hazards and Extreme Events", 
  "Water Management": "Water Management",
  "Waste and Resource Management": "Waste and Resource Management",
  "Sustainable Community Engagement": "Sustainable Community Engagement",
  "Construction and Design": "Construction and Design",
};

interface GameFilterPanelProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  search: string;
  setSearch: (s: string) => void;
  listMode: "grid" | "list";
  setListMode: (m: "grid" | "list") => void;
  yearOptions: string[];
}

export interface Filters {
  year: string;
  category: string;
  technology: string[];
  age: string[];
  purpose: string[];
  audience: string[];
  playerMode: string[];
}

export default function GameFilterPanel({
  filters,
  setFilters,
  search,
  setSearch,
  listMode,
  setListMode,
  yearOptions,
}: GameFilterPanelProps) {
  // For popover state on mobile
  const [filterOpen, setFilterOpen] = useState(false);

  // Handle checkbox value toggles
  function handleCheckbox(group: keyof Filters, value: string) {
    const arr = filters[group] as string[];
    if (arr.includes(value)) {
      setFilters({
        ...filters,
        [group]: arr.filter((v) => v !== value),
      });
    } else {
      setFilters({
        ...filters,
        [group]: [...arr, value],
      });
    }
  }

  // Clear all filters
  function clearFilters() {
    setFilters({
      year: "",
      category: "",
      technology: [],
      age: [],
      purpose: [],
      audience: [],
      playerMode: [],
    });
    setSearch("");
  }

  return (
    <div className="w-full flex flex-wrap items-end gap-3 bg-white/90 rounded-xl px-6 py-4 shadow-sm mb-4 border border-border">
      {/* Search bar */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Input
            className="pl-10"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* List/Grid toggle */}
      <div className="flex gap-2">
        <Button
          variant={listMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          aria-label="Grid view"
          onClick={() => setListMode("grid")}
        >
          <Grid2x2 />
        </Button>
        <Button
          variant={listMode === "list" ? "secondary" : "ghost"}
          size="icon"
          aria-label="List view"
          onClick={() => setListMode("list")}
        >
          <List />
        </Button>
      </div>

      {/* Filtering dropdowns/checklists */}
      <div className="flex flex-wrap gap-2">
        {/* Year */}
        <select
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm min-w-[100px]"
          value={filters.year}
          onChange={e => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {yearOptions.map(y => (
            <option value={y} key={y}>{y}</option>
          ))}
        </select>
        
        {/* Category */}
        <select
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm min-w-[140px]"
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categoryOptions.map(cat => (
            <option value={cat} key={cat}>{cat}</option>
          ))}
        </select>

        {/* Technology */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-3">
              Technology
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 z-50 bg-white" side="bottom">
            {techOptions.map(opt => (
              <label className="flex gap-2 mb-2 cursor-pointer items-center" key={opt}>
                <Checkbox
                  checked={filters.technology.includes(opt)}
                  onCheckedChange={() => handleCheckbox("technology", opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>

        {/* Age */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-3">
              Age
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 z-50 bg-white" side="bottom">
            {ageOptions.map(opt => (
              <label className="flex gap-2 mb-2 cursor-pointer items-center" key={opt}>
                <Checkbox
                  checked={filters.age.includes(opt)}
                  onCheckedChange={() => handleCheckbox("age", opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>

        {/* Purpose */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-3">
              Purpose
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 z-50 bg-white" side="bottom">
            {purposeOptions.map(opt => (
              <label className="flex gap-2 mb-2 cursor-pointer items-center" key={opt}>
                <Checkbox
                  checked={filters.purpose.includes(opt)}
                  onCheckedChange={() => handleCheckbox("purpose", opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>

        {/* Audience */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-3">
              Audience
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 z-50 bg-white" side="bottom">
            {audienceOptions.map(opt => (
              <label className="flex gap-2 mb-2 cursor-pointer items-center" key={opt}>
                <Checkbox
                  checked={filters.audience.includes(opt)}
                  onCheckedChange={() => handleCheckbox("audience", opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>

        {/* Player Mode */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-3">
              Player Mode
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 z-50 bg-white" side="bottom">
            {playerModeOptions.map(opt => (
              <label className="flex gap-2 mb-2 cursor-pointer items-center" key={opt}>
                <Checkbox
                  checked={filters.playerMode.includes(opt)}
                  onCheckedChange={() => handleCheckbox("playerMode", opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
        
        {/* Clear Filters Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="px-3 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
