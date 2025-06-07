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

// Real games data from forRepo (1).json
const realGames: GameData[] = [{
  id: 1,
  title: "Co-De|GT: The Gamification and Tokenisation of More-Than-Human Qualities and Values",
  description: "A gamified system that tokenizes environmental qualities and values for participatory urban development.",
  year: "2022",
  category: "Urban Development",
  technology: ["PC", "XR"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 2,
  title: "Methodology for creating digital twins for green hydrogen production",
  description: "A proposal for a digital twin-based simulation and VR game to educate about safety, technical and operational aspects of green hydrogen production",
  year: "2023",
  category: "Energy Efficiency and Transition",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 3,
  title: "TRAceS",
  description: "A serious game designed to simulate urban transformation scenarios aimed at achieving carbon neutrality in an interactive and collaborative virtual space for citizens, designers, and public administrators.",
  year: "2022",
  category: "Urban Development",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 4,
  title: "ByMaker",
  description: "A scenario-based serious game on the 3D map of Trondheim, allowing players to experiment with various urban development scenarios and make sustainable urban development decisions. The game covers areas such as road and transportation, urban nature, residential buildings, and public space.",
  year: "2023",
  category: "Urban Development",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 5,
  title: "VR Serious Game for Heat Wave and Earthquake Training",
  description: "This VR-SG is designed for risk training in urban open spaces, addressing hazards such as heat waves and earthquakes through immersive and non-immersive experiences in a simulated outdoor environment with temperatures, falling debris, and crowd motion.",
  year: "2023",
  category: "Natural Hazards",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Pedagogy", "Participation"],
  link: ""
}, {
  id: 6,
  title: "GAIA Challenge",
  description: "The GAIA Challenge engages students in first-hand activities centered around sustainability and energy efficiency by using IoT-based tools within educational settings and gamification elements such as quests and competitions.",
  year: "2023",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 7,
  title: "ParmoSense",
  description: "A participatory mobile urban sensing platform that leverages mobile device sensors to collect and analyse urban data.",
  year: "2022",
  category: "Urban Development",
  technology: ["PC", "XR"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 8,
  title: "Sustainability Futures Game",
  description: "To support business leaders and city officials envisioning alternative urban futures. It facilitates participatory creation through storytelling and worldbuilding, focusing on sustainable urban living and achieving the Sustainable Development Goals by 2030 while identifying critical issues and solutions to these goals.",
  year: "2022",
  category: "Urban Development",
  technology: ["PC", "Physical"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 9,
  title: "BLUTUBE",
  description: "A game-based educational program that teaches primary school students about water cycles, water waste, and efficient water usage through gamification methods such as points, leaderboards, and prizes. It involves a series of interactive and gamified activities, including playing a custom board game or taking photos of sustainable behaviour.",
  year: "2023",
  category: "Water",
  technology: ["Hybrid"],
  age: ["Children"],
  purpose: ["Pedagogy", "Persuasion"],
  link: ""
}, {
  id: 10,
  title: "VR Co-Design for Elevated Urban Spaces",
  description: "Using VR to enhance the design experience, allowing participants to engage interactively with design processes, testing and visualising changes in real-time, or in other words, facilitating public engagement and co-design in developing elevated urban spaces in London, such as the Sky Garden and Crossrail Place.",
  year: "2023",
  category: "Urban Development",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 11,
  title: "Waste Management Tool: Stakeholders",
  description: "A 3D top-down serious game developed using Agile methodology and incorporating critical waste management KPIs into gameplay to allow users to input, interact with, and analyse data relevant to their specific urban areas.",
  year: "2022",
  category: "Circular Economy",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 12,
  title: "Adaptive Thermal Comfort Smart Home Game",
  description: "The proposed game uses energy simulations and gamification to engage users in learning about and improving thermal comfort in smart homes without losing energy efficiency by playing around with variables such as clothing insulation and activity levels in residential settings.",
  year: "2022",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 13,
  title: "GARDENS GAMIFICATION",
  description: "By integrating gamification elements into public green spaces with geospatial data and land surveying techniques, a gamified system was tested to engage the general public through real and virtual thematic paths and optimise the management of urban green spaces in Ancona, Italy.",
  year: "2023",
  category: "Urban Development",
  technology: ["PC", "XR"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 14,
  title: "Green Bear",
  description: "Uses IoT, LoRaWAN public networks, and Human-in-the-Loop technologies to promote sustainability and citizen participation in a smart city.",
  year: "2022",
  category: "Urban Development",
  technology: ["PC", "XR"],
  age: ["Adults"],
  purpose: ["Persuasion", "Participation"],
  link: ""
}, {
  id: 15,
  title: "Illumi's World",
  description: "Students can manipulate building configurations and energy options, review energy costs and emission level changes, and monitor performance through game dashboards supported by BIM models.",
  year: "2023",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 16,
  title: "NextGen Water Circular Economy",
  description: "Promotes understanding of the circular economy of water through interactive scenarios that explore water management strategies, including wastewater recycling for various secondary uses in urban settings.",
  year: "2023",
  category: "Water",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Pedagogy", "Participation"],
  link: ""
}, {
  id: 17,
  title: "AquaCITY",
  description: "Designed as a research and capacity-building method to help city administrators deepen their understanding of context-specific sustainability transformations, challenges and adaptations while building transformative capacity.",
  year: "2022",
  category: "Urban Development",
  technology: ["Physical"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 18,
  title: "iWARN",
  description: "A people-centred early warning system (EWS) that integrates citizens into the emergency management process using mobile computing and gamification elements (missions and rewards). The system enables citizens to act as intelligent sensors, collecting and sharing information about potential hazards.",
  year: "2022",
  category: "Natural Hazards",
  technology: ["PC", "XR"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 19,
  title: "SUSTAIN AR Game",
  description: "An AR-based serious game to enhance players' awareness and commitment by assuming the roles of city policymakers working together to achieve sustainable urban development balance between economic, social, and environmental goals",
  year: "2023",
  category: "Urban Development",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Pedagogy", "Persuasion"],
  link: ""
}, {
  id: 20,
  title: "GAIA Educational Platform",
  description: "An educative web game platform focusing on sustainability awareness and energy-related aspects. GAIA has gamification elements, such as interactive quiz-based missions, hands-on activities, dashboards, and combined sensor data, to teach students about energy efficiency. This paper discusses the successful game test over 25 schools across three countries, involving 3762 registered users.",
  year: "2023",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 21,
  title: "Inside the Box",
  description: "To create energy-efficient retail spaces by training employees through role-playing as different store roles, e.g., customer assistant, store manager, and showing operations such as keeping the door of a freezer is impactful.",
  year: "2019",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 22,
  title: "Multi-Agent Recycling System",
  description: "A multi-agent system using the Context-Aware Framework for Collaborative Learning Applications (CAFCLA) to enhance recycling rates through increased citizen participation by employing gamification techniques to engage users actively by offering rewards and penalties based on their recycling behaviours after collecting data from user interactions and waste metrics in order to optimise and adapt recycling processes in real time.",
  year: "2018",
  category: "Circular Economy",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 23,
  title: "GReSBAS",
  description: "A gamified platform for energy feedback and usage forecasting.",
  year: "2017",
  category: "Energy Efficiency and Transition",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 24,
  title: "GAIA Challenge (2019)",
  description: "The GAIA project provided and evaluated serious games (offline and online) for high school students to equip them with a practical understanding of energy savings and sustainability using gamification and IoT-based educational tools, making learning interactive and engaging.",
  year: "2019",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 25,
  title: "Buy, Sell, and Trade@TERRE",
  description: "Taking place in a fictitious territory, Canka Province, and involves negotiating ecosystem services (e.g., water purification, flood prevention, soil preservation, food production, and rural tourism via recreational values) delivery and trade-offs among five role playing: local government, private energy company, farmers' cooperative, environmental NGO, and a local ecotourism business",
  year: "2018",
  category: "Urban Development",
  technology: ["Physical"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 26,
  title: "Quiz App",
  description: "A gamified quiz app in an Urban Water Management course for engineering students",
  year: "2019",
  category: "Water",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 27,
  title: "Plug Load Management System",
  description: "The paper discusses the impact of a new plug load management system (a slightly gamified mobile app), which combines active occupant engagement with automation technologies to reduce the energy consumption of plug loads.",
  year: "2018",
  category: "Energy Efficiency and Transition",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 28,
  title: "WasteApp",
  description: "The Wasteapp system promotes responsible waste management and recycling behaviours among tourists in urban destinations through gamified interactions, offering rewards and social recognition to encourage the reduction of the ecological impact of tourism.",
  year: "2018",
  category: "Circular Economy",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 29,
  title: "GAIA Challenge (2018)",
  description: "GAIA Challenge uses gamification mechanics to motivate students and teachers to engage in energy-saving topics, work on online quests, participate in real-life activities, experience their impact on energy consumption and compete and compare against other classes in their schools based on real-time data provided by sensors in the school.",
  year: "2018",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 30,
  title: "STERLING",
  description: "Uses IoT technologies and Bluetooth Low Energy (BLE) to measure fill levels and environmental conditions, and to monitor and manage waste recycling containers efficiently. Sterling rewards users for their recycling efforts, thereby enhancing participation.",
  year: "2018",
  category: "Circular Economy",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 31,
  title: "Urban Mini-Games Collection",
  description: "Floating City: Players propose ideas, needs, wishes, values, and visions to adapt or improve their city. Safari: Simulates a city where players implement projects to make it more sustainable. CityMakers: Challenges players to set up projects and understand the logic of initiating and collaborating on projects. PoliCity: Players manage an area of a city, implement projects, and coordinate with other stakeholders.",
  year: "2017",
  category: "Urban Development",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 32,
  title: "Urban Infrastructure AR System",
  description: "A mobile system with interactive maps and AR to allow users to report and address urban infrastructure issues. It operates in three modes: Finder, Fixer, and Validator, each designed for different types of user engagement, from reporting problems to validating repairs",
  year: "2019",
  category: "Water",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 33,
  title: "GAIA (2017)",
  description: "Using gamification mechanics to motivate participants to engage in energy-saving activities, work on quests, participate in real-life activities, and compete with peers to reduce energy consumption in school buildings.",
  year: "2017",
  category: "Energy Efficiency and Transition",
  technology: ["PC", "XR"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 34,
  title: "Recycling Gamification System",
  description: "Proposing integration of gamification techniques with a multi-agent context-aware framework to dynamically adapt and promote citizen recycling behavior through economic incentives.",
  year: "2018",
  category: "Circular Economy",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 35,
  title: "GAIA Challenge (Educational Kit)",
  description: "The GAIA challenge is a multi-purpose serious game that integrates IoT in school buildings across Greece, Italy, and Sweden to monitor and influence energy consumption behaviours and engage students with real-time data interactions. The project also includes an educational lab kit for hands-on activities.",
  year: "2019",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 36,
  title: "Smart Home Energy Gamification",
  description: "To reduce energy consumption in smart homes by promoting interaction and competition between smart homes within a community through collecting characteristics of end-users and using fuzzy logic to propose tailored machine interfaces in social products and smart homes.",
  year: "2020",
  category: "Energy Efficiency and Transition",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 37,
  title: "Social Power",
  description: "A community-level gamification system examining collaborative vs. competitive approaches to enhance household electricity-saving behavior.",
  year: "2018",
  category: "Energy Efficiency and Transition",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 38,
  title: "Tower of Infinity",
  description: "A one-player board game using LEGO bricks, designed to simulate an integrated design and construct project where the players act as main contractor to manage crews for modelling, ordering, and assembling tasks to meet client requirements and maximize profit.",
  year: "2017",
  category: "Construction",
  technology: ["Physical"],
  age: ["Adults"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 39,
  title: "SOCIALENERGY Game",
  description: "Using gamification to transform traditional utilities into progressive energy service providers by engaging customers, promoting energy-efficient behaviours, facilitating dynamic demand response programs, and enhancing communication among energy consumers, utilities, and other stakeholders.",
  year: "2018",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 40,
  title: "ChArGED",
  description: "Using gamification concepts such as team competitions, virtual rewards, and life simulation elements to engage users and encourage energy-saving actions, integrated with smart meters and sensors to provide detailed energy usage data, which is disaggregated at the device, area, and end-user levels.",
  year: "2018",
  category: "Energy Efficiency and Transition",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 41,
  title: "Social Mpower",
  description: "A virtual environment where players can learn and practice effective energy management strategies and coordinate regarding the impact of their individual actions.",
  year: "2018",
  category: "Energy Efficiency and Transition",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Pedagogy", "Participation"],
  link: ""
}, {
  id: 42,
  title: "Counter-attack of Urban Heat Island",
  description: "To educate primary school students about urban heat island effects. The game is designed to help children make decisions to balance economic growth and environmental sustainability.",
  year: "2019",
  category: "Urban Development",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 43,
  title: "Alter Eco",
  description: "To facilitate social education for sustainable development, create a digital twin of the town of Żuromin in Poland, and raise awareness among residents, local authorities, and agricultural producers about the benefits of collaborative smart city planning.",
  year: "2019",
  category: "Urban Development",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Participation"],
  link: ""
}, {
  id: 44,
  title: "Payt",
  description: "Aims to encourage waste segregation and reduce waste production through a gamified approach. Residents earn redeemable points for properly segregating waste.",
  year: "2020",
  category: "Circular Economy",
  technology: ["Physical"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 45,
  title: "GarbMAS",
  description: "GarbMAS is a multi-agent gamified system designed to enhance waste recycling and waste optimisation in urban areas using the CAFCLA (Context-Aware Framework for Collaborative Learning Applications) framework to capture data on the type of waste, the quantity, and user interactions at various collection points.",
  year: "2019",
  category: "Circular Economy",
  technology: ["Hybrid"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 46,
  title: "Lean Design Management Game",
  description: "Integrating the Last Planner® System (LPS) with gamification to improve lean design management by motivating engineers through performance-tied payments.",
  year: "2019",
  category: "Construction",
  technology: ["PC"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 47,
  title: "Let's Save the Water",
  description: "To raise awareness among children about the importance of water conservation and to promote environmental stewardship through interactive and engaging media",
  year: "2019",
  category: "Water",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 48,
  title: "Hydro Hero",
  description: "An educational game that tasks the player with cleaning and maintaining a canal environment through an avatar who collects harmful items from the canal while avoiding beneficial ones - inspired by the Dutch waterways situation.",
  year: "2019",
  category: "Water",
  technology: ["PC"],
  age: ["Children"],
  purpose: ["Pedagogy"],
  link: ""
}, {
  id: 49,
  title: "Ducky",
  description: "To quantify, visualise, and communicate users' everyday climate activities and carbon footprints and to motivate users to adopt environmental and climate-friendly behaviours.",
  year: "2016",
  category: "General Sustainable Development",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}, {
  id: 50,
  title: "Crowdsourcing Environmental Activism App",
  description: "A crowdsourcing app to enhance pro-environmental community activism through mobile data collection app",
  year: "2013",
  category: "Urban Development",
  technology: ["XR"],
  age: ["Adults"],
  purpose: ["Persuasion"],
  link: ""
}];
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
    audience: []
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
    
    // Audience filter - for now, we'll just allow all games through since we don't have audience data in the JSON
    // This can be updated when audience data is added to the game objects
    if (filters.audience.length) {
      // Currently no audience filtering logic since the data doesn't contain audience field
      // This is a placeholder for when audience data is available
    }

    // Keyword search
    if (search.trim() !== "") {
      const flat = [game.title, game.description, game.year, game.category, game.technology.join(" "), game.age.join(" "), game.purpose.join(" ")].join(" ").toLowerCase();
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
      if (["technology", "age", "purpose", "audience"].includes(field)) {
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
        <h1 className="text-4xl font-bold mb-2 text-center text-primary">Atlas of Sustainable & Circular 
Urban Built Environment Serious Games</h1>
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
