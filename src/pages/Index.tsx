
import { useState } from "react";
import GameFilterPanel, { Filters } from "@/components/GameFilterPanel";
import GameGrid from "@/components/GameGrid";
import { GameData } from "@/components/GameCard";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Sample data for games
const demoGames: GameData[] = [
  {
    id: 1,
    title: "Eco City Builder",
    description: "Plan and create a sustainable city using low-carbon strategies. Perfect for learning about circular urban solutions.",
    year: "2022",
    category: "Urban Planning",
    technology: ["PC", "XR"],
    age: ["Adults", "Children"],
    purpose: ["Pedagogy", "Participation"],
    link: "https://example.com/city-builder",
  },
  {
    id: 2,
    title: "Circular Quest",
    description: "An adventure game teaching circular economy principles. Mix of physical and digital for the classroom.",
    year: "2021",
    category: "Circular Economy",
    technology: ["Hybrid", "Physical"],
    age: ["Children"],
    purpose: ["Pedagogy"],
    link: "https://example.com/circular-quest",
  },
  {
    id: 3,
    title: "PersuadeXR",
    description: "Persuasive XR simulation about reducing building waste and persuading stakeholders.",
    year: "2023",
    category: "Sustainability",
    technology: ["XR"],
    age: ["Adults"],
    purpose: ["Persuasion"],
    link: "https://example.com/persuadexr",
  },
  {
    id: 4,
    title: "Participatory Planning Board",
    description: "In-person game to facilitate stakeholder engagement for green retrofits.",
    year: "2020",
    category: "Architecture",
    technology: ["Physical"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "https://example.com/planningboard",
  },
  // Add more demo items as you see fit
];

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
  });
  const [search, setSearch] = useState("");
  const [listMode, setListMode] = useState<"grid" | "list">("grid");
  const [modal, setModal] = useState<GameData | null>(null);

  // Prepare year options dynamically from data
  const yearOptions = uniqueValuesFor(demoGames, "year");

  // Filtering + Search logic
  const gamesFiltered = demoGames.filter(game => {
    // Filter by dropdowns
    if (filters.year && game.year !== filters.year) return false;
    if (filters.category && game.category !== filters.category) return false;
    // Tech, age, purpose (multi)
    if (filters.technology.length && !filters.technology.some(t => game.technology.includes(t))) return false;
    if (filters.age.length && !filters.age.some(a => game.age.includes(a))) return false;
    if (filters.purpose.length && !filters.purpose.some(p => game.purpose.includes(p))) return false;

    // Keyword search
    if (search.trim() !== "") {
      const flat = [
        game.title,
        game.description,
        game.year,
        game.category,
        game.technology.join(" "),
        game.age.join(" "),
        game.purpose.join(" "),
      ].join(" ").toLowerCase();
      return flat.includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col items-stretch">
      <div className="max-w-7xl w-full mx-auto py-10 px-2 sm:px-4">
        <h1 className="text-4xl font-bold mb-2 text-center text-primary">Atlas of Circular & Sustainable Built Environment Serious Games</h1>
        <p className="text-lg text-gray-500 mb-10 text-center max-w-[700px] mx-auto">
          Explore engaging serious games for learning and transformation in architecture, urban planning, and sustainability. Filter by platform, age, topic, and more.
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
        <GameGrid
          games={gamesFiltered}
          onMore={setModal}
          viewMode={listMode}
        />
      </div>
      {/* Modal for game details */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent>
          {modal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{modal.title}</DialogTitle>
              </DialogHeader>
              <div className="text-gray-700 mb-4">{modal.description}</div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs">{modal.year}</span>
                <span className="bg-green-50 text-green-800 px-2 py-0.5 rounded text-xs">{modal.category}</span>
                {modal.technology.map((t) => (
                  <span key={t} className="bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded text-xs">{t}</span>
                ))}
                {modal.purpose.map((p) => (
                  <span key={p} className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-xs">{p}</span>
                ))}
                {modal.age.map((a) => (
                  <span key={a} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{a}</span>
                ))}
              </div>
              <DialogFooter>
                {modal.link && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    aria-label={"External link to " + modal.title}
                  >
                    <a href={modal.link} target="_blank" rel="noopener noreferrer">
                      Visit Game Site
                    </a>
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => setModal(null)}
                  className="w-full mt-2"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <footer className="px-4 pb-8 pt-10 w-full text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Circular Atlas • Contact for contributions.
      </footer>
    </main>
  );
}
