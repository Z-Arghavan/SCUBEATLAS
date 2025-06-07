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

// Real games data from forRepo (1).json
const realGames: GameData[] = [
  {
    id: 1,
    title: "Co-De|GT: The Gamification and Tokenisation of More-Than-Human Qualities and Values",
    description: "A gamified system that tokenizes environmental qualities and values for participatory urban development.",
    year: "2022",
    category: "Urban Development",
    technology: ["PC", "XR"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 2,
    title: "Methodology for creating digital twins for green hydrogen production",
    description: "A proposal for a digital twin-based simulation and VR game to educate about safety, technical and operational aspects of green hydrogen production",
    year: "2023",
    category: "Energy Efficiency and Transition",
    technology: ["XR"],
    age: ["Adults"],
    purpose: ["Pedagogy"],
    link: "",
  },
  {
    id: 3,
    title: "TRAceS",
    description: "A serious game designed to simulate urban transformation scenarios aimed at achieving carbon neutrality in an interactive and collaborative virtual space for citizens, designers, and public administrators.",
    year: "2022",
    category: "Urban Development",
    technology: ["PC"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 4,
    title: "ByMaker",
    description: "A scenario-based serious game on the 3D map of Trondheim, allowing players to experiment with various urban development scenarios and make sustainable urban development decisions. The game covers areas such as road and transportation, urban nature, residential buildings, and public space.",
    year: "2023",
    category: "Urban Development",
    technology: ["PC"],
    age: ["Children"],
    purpose: ["Pedagogy"],
    link: "",
  },
  {
    id: 5,
    title: "VR Serious Game for Heat Wave and Earthquake Training",
    description: "This VR-SG is designed for risk training in urban open spaces, addressing hazards such as heat waves and earthquakes through immersive and non-immersive experiences in a simulated outdoor environment with temperatures, falling debris, and crowd motion.",
    year: "2023",
    category: "Natural Hazards",
    technology: ["XR"],
    age: ["Adults"],
    purpose: ["Pedagogy", "Participation"],
    link: "",
  },
  {
    id: 6,
    title: "GAIA Challenge",
    description: "The GAIA Challenge engages students in first-hand activities centered around sustainability and energy efficiency by using IoT-based tools within educational settings and gamification elements such as quests and competitions.",
    year: "2023",
    category: "Energy Efficiency and Transition",
    technology: ["PC"],
    age: ["Children"],
    purpose: ["Pedagogy"],
    link: "",
  },
  {
    id: 7,
    title: "ParmoSense",
    description: "A participatory mobile urban sensing platform that leverages mobile device sensors to collect and analyse urban data.",
    year: "2022",
    category: "Urban Development",
    technology: ["PC", "XR"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 8,
    title: "Sustainability Futures Game",
    description: "To support business leaders and city officials envisioning alternative urban futures. It facilitates participatory creation through storytelling and worldbuilding, focusing on sustainable urban living and achieving the Sustainable Development Goals by 2030 while identifying critical issues and solutions to these goals.",
    year: "2022",
    category: "Urban Development",
    technology: ["PC", "Physical"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 9,
    title: "BLUTUBE",
    description: "A game-based educational program that teaches primary school students about water cycles, water waste, and efficient water usage through gamification methods such as points, leaderboards, and prizes. It involves a series of interactive and gamified activities, including playing a custom board game or taking photos of sustainable behaviour.",
    year: "2023",
    category: "Water",
    technology: ["Hybrid"],
    age: ["Children"],
    purpose: ["Pedagogy", "Persuasion"],
    link: "",
  },
  {
    id: 10,
    title: "VR Co-Design for Elevated Urban Spaces",
    description: "Using VR to enhance the design experience, allowing participants to engage interactively with design processes, testing and visualising changes in real-time, or in other words, facilitating public engagement and co-design in developing elevated urban spaces in London, such as the Sky Garden and Crossrail Place.",
    year: "2023",
    category: "Urban Development",
    technology: ["XR"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 11,
    title: "Waste Management Tool: Stakeholders",
    description: "A 3D top-down serious game developed using Agile methodology and incorporating critical waste management KPIs into gameplay to allow users to input, interact with, and analyse data relevant to their specific urban areas.",
    year: "2022",
    category: "Circular Economy",
    technology: ["PC"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 12,
    title: "Adaptive Thermal Comfort Smart Home Game",
    description: "The proposed game uses energy simulations and gamification to engage users in learning about and improving thermal comfort in smart homes without losing energy efficiency by playing around with variables such as clothing insulation and activity levels in residential settings.",
    year: "2022",
    category: "Energy Efficiency and Transition",
    technology: ["PC"],
    age: ["Adults"],
    purpose: ["Pedagogy"],
    link: "",
  },
  {
    id: 13,
    title: "GARDENS GAMIFICATION",
    description: "By integrating gamification elements into public green spaces with geospatial data and land surveying techniques, a gamified system was tested to engage the general public through real and virtual thematic paths and optimise the management of urban green spaces in Ancona, Italy.",
    year: "2023",
    category: "Urban Development",
    technology: ["PC", "XR"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 14,
    title: "Green Bear",
    description: "Uses IoT, LoRaWAN public networks, and Human-in-the-Loop technologies to promote sustainability and citizen participation in a smart city.",
    year: "2022",
    category: "Urban Development",
    technology: ["PC", "XR"],
    age: ["Adults"],
    purpose: ["Persuasion", "Participation"],
    link: "",
  },
  {
    id: 15,
    title: "Illumi's World",
    description: "Students can manipulate building configurations and energy options, review energy costs and emission level changes, and monitor performance through game dashboards supported by BIM models.",
    year: "2023",
    category: "Energy Efficiency and Transition",
    technology: ["PC"],
    age: ["Children"],
    purpose: ["Pedagogy"],
    link: "",
  },
  {
    id: 16,
    title: "NextGen Water Circular Economy",
    description: "Promotes understanding of the circular economy of water through interactive scenarios that explore water management strategies, including wastewater recycling for various secondary uses in urban settings.",
    year: "2023",
    category: "Water",
    technology: ["PC"],
    age: ["Adults"],
    purpose: ["Pedagogy", "Participation"],
    link: "",
  },
  {
    id: 17,
    title: "AquaCITY",
    description: "Designed as a research and capacity-building method to help city administrators deepen their understanding of context-specific sustainability transformations, challenges and adaptations while building transformative capacity.",
    year: "2022",
    category: "Urban Development",
    technology: ["Physical"],
    age: ["Adults"],
    purpose: ["Pedagogy"],
    link: "",
  },
  {
    id: 18,
    title: "iWARN",
    description: "A people-centred early warning system (EWS) that integrates citizens into the emergency management process using mobile computing and gamification elements (missions and rewards). The system enables citizens to act as intelligent sensors, collecting and sharing information about potential hazards.",
    year: "2022",
    category: "Natural Hazards",
    technology: ["PC", "XR"],
    age: ["Adults"],
    purpose: ["Participation"],
    link: "",
  },
  {
    id: 19,
    title: "SUSTAIN AR Game",
    description: "An AR-based serious game to enhance players' awareness and commitment by assuming the roles of city policymakers working together to achieve sustainable urban development balance between economic, social, and environmental goals",
    year: "2023",
    category: "Urban Development",
    technology: ["XR"],
    age: ["Adults"],
    purpose: ["Pedagogy", "Persuasion"],
    link: "",
  },
  {
    id: 20,
    title: "GAIA Educational Platform",
    description: "An educative web game platform focusing on sustainability awareness and energy-related aspects. GAIA has gamification elements, such as interactive quiz-based missions, hands-on activities, dashboards, and combined sensor data, to teach students about energy efficiency. This paper discusses the successful game test over 25 schools across three countries, involving 3762 registered users.",
    year: "2023",
    category: "Energy Efficiency and Transition",
    technology: ["PC"],
    age: ["Children"],
    purpose: ["Pedagogy"],
    link: "",
  }
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
  const yearOptions = uniqueValuesFor(realGames, "year");

  // Filtering + Search logic
  const gamesFiltered = realGames.filter(game => {
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

  const navigate = useNavigate();

  // Chip filter event handler
  useEffect(() => {
    function onChip(ev: any) {
      const { field, value } = ev.detail || {};
      if (!field || !value) return;
      if (["technology", "age", "purpose"].includes(field)) {
        setFilters(f => ({
          ...f,
          [field]: [value],
        }));
      } else {
        setFilters(f => ({
          ...f,
          [field]: value,
        }));
      }
      // Optionally clear search on chip click
      setSearch("");
    }
    window.addEventListener("gamefilter:chip", onChip);
    return () => window.removeEventListener("gamefilter:chip", onChip);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col items-stretch">
      <Header />
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
      <Footer />
    </main>
  );
}
