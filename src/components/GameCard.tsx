
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  link?: string;
}

export default function GameCard({ game, onMore, viewMode = "grid" }: GameCardProps) {
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
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{game.year}</span>
          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{game.category}</span>
          {game.technology.map(tech => (
            <span key={tech} className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">{tech}</span>
          ))}
          {game.purpose.map(p => (
            <span key={p} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">{p}</span>
          ))}
          {game.age.map(a => (
            <span key={a} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{a}</span>
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
