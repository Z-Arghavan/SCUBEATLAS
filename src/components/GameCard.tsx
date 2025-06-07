
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  game: GameData;
  onMore: (game: GameData) => void;
  viewMode?: "grid" | "list";
}

export interface GameData {
  id: number;
  title: string;
  description: string;
  year: string;
  category: string;
  technology: string[];
  age: string[];
  purpose: string[];
  audience: string[];
  playerMode?: string[];
  link?: string;
}

// Reverse mapping from JSON categories to user categories
const reverseMapping: Record<string, string> = {
  "General Sustainable Development": "Sustainable Community Engagement",
  "Natural Hazards": "Natural Hazards and Extreme Events",
  "Urban Development": "Urban Development and Planning",
  "Energy Efficiency and Transition": "Energy Efficiency and Transition",
  "Water": "Water Management",
  "Circular Economy": "Waste and Resource Management",
  "Construction": "Construction and Architecture",
};

export default function GameCard({ game, onMore, viewMode = "grid" }: GameCardProps) {
  const navigate = useNavigate();

  // Helper to call parent to update filters
  function handleFilter(field: keyof GameData, value: string) {
    // Special event: emit window event and page will handle filter update
    window.dispatchEvent(new CustomEvent("gamefilter:chip", { detail: { field, value } }));
    // Optionally scroll to main results pane
    const el = document.getElementById("main-results");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Get user-friendly category label
  const getUserCategory = (jsonCategory: string) => {
    return reverseMapping[jsonCategory] || jsonCategory;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white shadow transition-all relative hover:shadow-md focus-within:ring-2 focus-within:ring-blue-200 flex",
        viewMode === "list" ? "flex-row px-6 py-4 gap-6 w-full" : "flex-col p-4 max-w-[360px] w-full"
      )}
    >
      <div className={cn(
        "flex-1 min-w-0",
        viewMode === "list" ? "" : "mb-5"
      )}>
        <h2 className="text-lg font-semibold truncate mb-1">{game.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{game.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-blue-100 focus:outline-none"
            onClick={() => handleFilter("year", game.year)}
            aria-label={"Filter by year " + game.year}
          >
            {game.year}
          </button>
          <button
            className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs hover:bg-green-100 focus:outline-none"
            onClick={() => handleFilter("category", game.category)}
            aria-label={"Filter by category " + getUserCategory(game.category)}
          >
            {getUserCategory(game.category)}
          </button>
          {game.technology.map(tech => (
            <button
              key={tech}
              className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs hover:bg-yellow-100 focus:outline-none"
              onClick={() => handleFilter("technology", tech)}
              aria-label={"Filter by technology " + tech}
            >
              {tech}
            </button>
          ))}
          {game.purpose.map(p => (
            <button
              key={p}
              className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs hover:bg-purple-100 focus:outline-none"
              onClick={() => handleFilter("purpose", p)}
              aria-label={"Filter by purpose " + p}
            >
              {p}
            </button>
          ))}
          {game.age.map(a => (
            <button
              key={a}
              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs hover:bg-gray-200 focus:outline-none"
              onClick={() => handleFilter("age", a)}
              aria-label={"Filter by age " + a}
            >
              {a}
            </button>
          ))}
          {game.audience.map(audience => (
            <button
              key={audience}
              className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-xs hover:bg-pink-100 focus:outline-none"
              onClick={() => handleFilter("audience", audience)}
              aria-label={"Filter by audience " + audience}
            >
              {audience}
            </button>
          ))}
        </div>
      </div>
      <div className={cn(
        "flex-shrink-0 flex items-end justify-end",
        viewMode === "list" ? "items-center" : ""
      )}>
        <Button size="sm" onClick={() => onMore(game)} className="ml-auto mt-2">
          More
        </Button>
      </div>
    </div>
  );
}
