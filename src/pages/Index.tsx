import { useState } from "react";
import GameFilterPanel, { Filters } from "@/components/GameFilterPanel";
import GameGrid from "@/components/GameGrid";
import { GameData } from "@/components/GameCard";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Updated mapping for audience codes to user-friendly labels
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

// Simplified technology mapping
const technologyMapping: Record<string, string> = {
  "PC": "Digital",
  "Mobile": "Digital",
  "Multi-platform": "Digital",
  "VR/AR": "Virtual Reality (XR)",
  "Physical": "Physical",
  "Hybrid": "Hybrid"
};

// Helper function to clean text data
function cleanText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  return text
    .replace(/GrEnergy Efficiency and Transitionn/g, "Green")
    .replace(/Energy Efficiency and Transitionn/g, "Energy Efficiency and Transition")
    .replace(/stUrban Developmentents/g, "students")
    .replace(/enginEnergy Efficiency and Transitionring/g, "engineering")
    .replace(/inclUrban Developmentes/g, "includes")
    .replace(/Urban Developmentent/g, "student")
    .replace(/€/g, "—")
    .trim();
}

// Helper function to normalize category names to match filter dropdown exactly
function normalizeCategory(category: string): string {
  if (!category) return "General Sustainable Development";
  
  const cleaned = cleanText(category);
  
  // Map common variations to the exact filter dropdown categories
  const categoryMap: Record<string, string> = {
    "Green": "Energy Efficiency and Transition",
    "Circular Economy": "Circular Economy",
    "Construction": "Construction", 
    "Water": "Water",
    "Urban Development": "Urban Development",
    "Natural Hazards": "Natural Hazards"
  };
  
  return categoryMap[cleaned] || "General Sustainable Development";
}

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
    const parts = purposeData.split('/').map(p => p.trim());
    const mappedParts = parts.map(p => purposeMapping[p]).filter(Boolean);
    
    // Return individual purposes plus their combination
    const result = [...mappedParts];
    if (mappedParts.length > 1) {
      result.push(mappedParts.join(' & '));
    }
    return result;
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

// Simplified technology parsing function
function parseTechnology(techData: any): string[] {
  if (!techData) return ["Digital"];
  
  const tech = String(techData).toLowerCase().trim();
  
  // Handle N/A cases
  if (tech.includes('n/a') || tech === '') {
    return ["Digital"];
  }
  
  // Handle hybrid cases (combinations with boardgame)
  if ((tech.includes('boardgame') || tech.includes('board game')) && 
      (tech.includes('pc') || tech.includes('mobile') || tech.includes('ar') || tech.includes('vr'))) {
    return ["Hybrid"];
  }
  
  // Handle physical games
  if (tech.includes('boardgame') || tech.includes('board game') || 
      tech.includes('escape room') || tech === 'physical') {
    return ["Physical"];
  }
  
  // Handle VR/AR/XR
  if (tech.includes('vr') || tech.includes('ar') || tech.includes('xr')) {
    return ["Virtual Reality (XR)"];
  }
  
  // Everything else is digital
  return ["Digital"];
}

// Function to convert new JSON format to GameData format
function convertJsonToGameData(jsonItem: any, index: number): GameData {
  console.log('Converting item:', jsonItem);
  
  const cleanTitle = cleanText(jsonItem.Title || "Untitled Article");
  const cleanDescription = cleanText(jsonItem.Description || "No description available");
  const cleanCategory = normalizeCategory(jsonItem.category);
  
  return {
    id: index + 1,
    title: cleanTitle,
    description: cleanDescription,
    year: String(jsonItem.Year || "Unknown"),
    category: cleanCategory,
    technology: parseTechnology(jsonItem["PC/mobile"]),
    age: parseAge(jsonItem["Child/Adult"]),
    purpose: parsePurpose(jsonItem["Pe/Pu/Pa"]),
    audience: parseAudience(jsonItem["Student/Business/GeneralPublic"]),
    playerMode: parsePlayerMode(jsonItem["Multi/single/Both player"]),
    link: "",
    gameName: cleanText(jsonItem.GameName || jsonItem.Title || "Untitled Game"),
    originalTechnology: jsonItem["PC/mobile"]
  };
}

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
  // State for games data
  const [realGames, setRealGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('./forRepo_Data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Raw response text (first 500 chars):', text.substring(0, 500));
        
        // Replace NaN with null to make valid JSON
        const cleanText = text.replace(/\bNaN\b/g, 'null');
        const jsonData = JSON.parse(cleanText);
        
        console.log('Parsed JSON data length:', jsonData.length);
        console.log('Sample data item:', jsonData[0]);
        
        // Convert the data to GameData format
        const games = jsonData.map(convertJsonToGameData);
        console.log('Converted games count:', games.length);
        console.log('Sample converted game:', games[0]);
        console.log('All unique categories:', [...new Set(games.map(g => g.category))].sort());
        
        setRealGames(games);
        setLoading(false);
      } catch (error) {
        console.error('Error loading game data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Prepare year options dynamically from data
  const yearOptions = uniqueValuesFor(realGames, "year");

  // Filtering + Search logic - simplified category filtering
  const gamesFiltered = realGames.filter(game => {
    // Filter by dropdowns
    if (filters.year && game.year !== filters.year) return false;
    
    // Direct category filtering using the exact filter dropdown values
    if (filters.category && game.category !== filters.category) return false;
    
    // Tech, age, purpose (multi)
    if (filters.technology.length && !filters.technology.some(t => game.technology.includes(t))) return false;
    if (filters.age.length && !filters.age.some(a => game.age.includes(a))) return false;
    if (filters.purpose.length && !filters.purpose.some(p => game.purpose.includes(p))) return false;
    
    // Audience filter
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

  // Chip filter event handler - simplified for direct category filtering
  useEffect(() => {
    function onChip(ev: any) {
      const { field, value } = ev.detail || {};
      if (!field || !value) return;
      
      if (["technology", "age", "purpose", "audience", "playerMode"].includes(field)) {
        setFilters(f => ({
          ...f,
          [field]: [value]
        }));
      } else {
        // Direct assignment for category and year
        setFilters(f => ({
          ...f,
          [field]: value
        }));
      }
      setSearch("");
    }
    window.addEventListener("gamefilter:chip", onChip);
    return () => window.removeEventListener("gamefilter:chip", onChip);
  }, []);

  console.log('Real games state:', realGames);
  console.log('Filtered games:', gamesFiltered);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col items-stretch">
        <Header />
        <div className="max-w-7xl w-full mx-auto py-10 px-2 sm:px-4 flex justify-center items-center min-h-96">
          <div className="text-lg text-gray-500">Loading games...</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col items-stretch">
      <Header />
      <div className="max-w-7xl w-full mx-auto py-10 px-2 sm:px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">Atlas of Sustainable & Circular Urban Built Environment Serious Games</h1>
        <p className="text-lg text-gray-500 mb-10 text-center max-w-[700px] mx-auto">
        </p>
        <GameFilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          search={search} 
          setSearch={setSearch} 
          listMode={listMode} 
          setListMode={setListMode} 
          yearOptions={yearOptions} 
        />
        <div className="mb-4 text-sm text-gray-600">
          Showing {gamesFiltered.length} of {realGames.length} games
        </div>
        <GameGrid games={gamesFiltered} onMore={setModal} viewMode={listMode} />
      </div>
      
      {/* Modal for game details */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent>
          {modal && <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{modal.gameName || modal.title}</DialogTitle>
                {modal.gameName && modal.title !== modal.gameName && (
                  <p className="text-sm text-gray-600 mt-1">Article: {modal.title}</p>
                )}
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
    </main>
  );
}
