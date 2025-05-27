
import GameCard, { GameData } from "./GameCard";

interface GameGridProps {
  games: GameData[];
  onMore: (game: GameData) => void;
  viewMode: "grid" | "list";
}

export default function GameGrid({ games, onMore, viewMode }: GameGridProps) {
  if (games.length === 0)
    return (
      <div className="w-full text-center text-gray-500 p-10">
        No games match your filters.
      </div>
    );

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-6"
          : "flex flex-col gap-4 py-6"
      }
    >
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onMore={onMore}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
