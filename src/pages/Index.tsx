import { useState } from "react";
import GameFilterPanel, { Filters, categoryMapping } from "@/components/GameFilterPanel";
import GameGrid from "@/components/GameGrid";
import { GameData } from "@/components/GameCard";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mapping for audience codes to user-friendly labels
const audienceMapping: Record<string, string> = {
  "S": "Students",
  "B": "Business Professionals", 
  "G": "General Public"
};

// Mapping for player mode codes to user-friendly labels
const playerModeMapping: Record<string, string> = {
  "B": "Both",
  "M": "Multi Player",
  "S": "Single Player"
};

// Mapping for purpose codes to user-friendly labels
const purposeMapping: Record<string, string> = {
  "Pe": "Pedagogy",
  "Pu": "Persuasion", 
  "Pa": "Participation"
};

// Mapping for age codes to user-friendly labels
const ageMapping: Record<string, string> = {
  "C": "Children",
  "A": "Adults"
};

// Mapping for technology codes to user-friendly labels
const technologyMapping: Record<string, string> = {
  "PC": "PC",
  "Mobile": "Mobile",
  "Multi-platform": "PC",
  "VR/AR": "XR",
  "Physical": "Physical",
  "Hybrid": "Hybrid"
};

// Helper function to parse audience from JSON data
function parseAudience(audienceData: any): string[] {
  if (!audienceData) return [];
  const mapped = audienceMapping[audienceData];
  return mapped ? [mapped] : [];
}

// Helper function to parse player mode from JSON data
function parsePlayerMode(playerModeData: any): string[] {
  if (!playerModeData) return [];
  const mapped = playerModeMapping[playerModeData];
  return mapped ? [mapped] : [];
}

// Helper function to parse purpose from JSON data
function parsePurpose(purposeData: any): string[] {
  if (!purposeData) return [];
  
  // Handle multiple purposes separated by /
  if (typeof purposeData === 'string' && purposeData.includes('/')) {
    return purposeData.split('/').map(p => purposeMapping[p.trim()]).filter(Boolean);
  }
  
  const mapped = purposeMapping[purposeData];
  return mapped ? [mapped] : [];
}

// Helper function to parse age from JSON data
function parseAge(ageData: any): string[] {
  if (!ageData) return [];
  const mapped = ageMapping[ageData];
  return mapped ? [mapped] : [];
}

// Helper function to parse technology from JSON data
function parseTechnology(techData: any): string[] {
  if (!techData) return ["PC"]; // Default fallback
  const mapped = technologyMapping[techData];
  return mapped ? [mapped] : [techData];
}

// Function to convert new JSON format to GameData format
function convertJsonToGameData(jsonItem: any, index: number): GameData {
  return {
    id: index + 1,
    title: jsonItem.Title || jsonItem.GameName || "Untitled Game",
    description: jsonItem.Description || "No description available",
    year: String(jsonItem.Year || "Unknown"),
    category: jsonItem.category || "General Sustainable Development",
    technology: parseTechnology(jsonItem["PC/mobile"]),
    age: parseAge(jsonItem["Child/Adult"]),
    purpose: parsePurpose(jsonItem["Pe/Pu/Pa"]),
    audience: parseAudience(jsonItem["Student/Business/GeneralPublic"]),
    playerMode: parsePlayerMode(jsonItem["Multi/single/Both player"]),
    link: ""
  };
}

// Sample data using your new format - replace this with your actual JSON data
const sampleNewFormatData = [{
  "Title": "Co-De|GT: The Gamification and Tokenisation of More-Than-Human Qualities and Values",
  "Year": 2022.0,
  "Type (SG, GS, R)": "GS",
  "Pe/Pu/Pa": "Pa",
  "GameName": "Co-De|GT",
  "On/Off-line": "N",
  "Multi/single/Both player": "S",
  "Child/Adult": "A",
  "Student/Business/GeneralPublic": "G",
  "category": "Urban Development and Planning",
  "Description": "A gamified system that tokenizes environmental qualities and values for participatory urban development.",
  "PC/mobile": "Multi-platform"
}];

// Convert the new format data to GameData format
const realGames: GameData[] = sampleNewFormatData.map(convertJsonToGameData);

function uniqueValuesFor(games: GameData[], field: keyof GameData): string[] {
  const set = new Set<string>();
  games.forEach(g => {
    const value = g[field];
    if (Array.isArray(value)) {
      value.forEach(v => set.add(v));
    } else {
      set.add(String(value));
    }
  });
  // Years sorted desc
  if (field === "year") return Array.from(set).sort((a, b) => Number(b) - Number(a));
  return Array.from(set).sort();
}

export default function Index() {
  // Filtering state
  const [filters, setFilters] = useState<Filters>({
    year: "",
    category: "",
    technology: [],
    age: [],
    purpose: [],
    audience: [],
    playerMode: []
  });
  const [search, setSearch] = useState("");
  const [listMode, setListMode] = useState<"grid" | "list">("grid");
  const [modal, setModal] = useState<GameData | null>(null);

  // Prepare year options dynamically from data
  const yearOptions = uniqueValuesFor(realGames, "year");

  // Filtering + Search logic
  const gamesFiltered = realGames.filter(game => {
    // Filter by dropdowns
    if (filters.year && game.year !== filters.year) return false;
    
    // Map user category to JSON category for filtering
    if (filters.category) {
      const jsonCategory = categoryMapping[filters.category];
      if (jsonCategory && game.category !== jsonCategory) return false;
    }
    
    // Tech, age, purpose (multi)
    if (filters.technology.length && !filters.technology.some(t => game.technology.includes(t))) return false;
    if (filters.age.length && !filters.age.some(a => game.age.includes(a))) return false;
    if (filters.purpose.length && !filters.purpose.some(p => game.purpose.includes(p))) return false;
    
    // Audience filter - now properly implemented
    if (filters.audience.length && !filters.audience.some(a => game.audience.includes(a))) return false;

    // Player Mode filter
    if (filters.playerMode.length && !filters.playerMode.some(pm => game.playerMode?.includes(pm))) return false;

    // Keyword search
    if (search.trim() !== "") {
      const flat = [game.title, game.description, game.year, game.category, game.technology.join(" "), game.age.join(" "), game.purpose.join(" "), game.audience.join(" ")].join(" ").toLowerCase();
      return flat.includes(search.toLowerCase());
    }
    return true;
  });
  const navigate = useNavigate();

  // Chip filter event handler
  useEffect(() => {
    function onChip(ev: any) {
      const {
        field,
        value
      } = ev.detail || {};
      if (!field || !value) return;
      if (["technology", "age", "purpose", "audience", "playerMode"].includes(field)) {
        setFilters(f => ({
          ...f,
          [field]: [value]
        }));
      } else if (field === "category") {
        // Find the user category that maps to this JSON category
        const userCategory = Object.keys(categoryMapping).find(key => categoryMapping[key] === value);
        setFilters(f => ({
          ...f,
          [field]: userCategory || value
        }));
      } else {
        setFilters(f => ({
          ...f,
          [field]: value
        }));
      }
      // Optionally clear search on chip click
      setSearch("");
    }
    window.addEventListener("gamefilter:chip", onChip);
    return () => window.removeEventListener("gamefilter:chip", onChip);
  }, []);

  return <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col items-stretch">
      <Header />
      <div className="max-w-7xl w-full mx-auto py-10 px-2 sm:px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">Atlas of Sustainable & Circular Urban Built Environment Serious Games</h1>
        <p className="text-lg text-gray-500 mb-10 text-center max-w-[700px] mx-auto">
      </p>
        <GameFilterPanel filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} listMode={listMode} setListMode={setListMode} yearOptions={yearOptions} />
        <GameGrid games={gamesFiltered} onMore={setModal} viewMode={listMode} />
      </div>
      {/* Modal for game details */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent>
          {modal && <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{modal.title}</DialogTitle>
              </DialogHeader>
              <div className="text-gray-700 mb-4">{modal.description}</div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs">{modal.year}</span>
                <span className="bg-green-50 text-green-800 px-2 py-0.5 rounded text-xs">{modal.category}</span>
                {modal.technology.map(t => <span key={t} className="bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded text-xs">{t}</span>)}
                {modal.purpose.map(p => <span key={p} className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-xs">{p}</span>)}
                {modal.age.map(a => <span key={a} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{a}</span>)}
                {modal.audience.map(a => <span key={a} className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-xs">{a}</span>)}
              </div>
              <DialogFooter>
                {modal.link && <Button asChild variant="outline" className="w-full" aria-label={"External link to " + modal.title}>
                    <a href={modal.link} target="_blank" rel="noopener noreferrer">
                      Visit Game Site
                    </a>
                  </Button>}
                <Button variant="secondary" onClick={() => setModal(null)} className="w-full mt-2">
                  Close
                </Button>
              </DialogFooter>
            </>}
        </DialogContent>
      </Dialog>
      <Footer />
    </main>;
}
