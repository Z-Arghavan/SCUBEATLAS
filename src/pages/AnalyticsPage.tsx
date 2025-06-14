import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameData } from "@/components/GameCard";

// Helper functions from Index.tsx
function cleanText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/GrEnergy Efficiency and Transitionn/g, "Green").replace(/Energy Efficiency and Transitionn/g, "Energy Efficiency and Transition").replace(/stUrban Developmentents/g, "students").replace(/enginEnergy Efficiency and Transitionring/g, "engineering").replace(/inclUrban Developmentes/g, "includes").replace(/Urban Developmentent/g, "student").replace(/€/g, "—").trim();
}
function normalizeCategory(category: string): string {
  if (!category) return "Sustainable Community Engagement";
  const cleaned = cleanText(category);
  const categoryMap: Record<string, string> = {
    "Urban Development and Planning": "Urban Development and Planning",
    "Energy Efficiency and Transition": "Energy Efficiency and Transition",
    "Natural Hazards and Extreme Events": "Natural Hazards and Extreme Events",
    "Water Management": "Water Management",
    "Waste and Resource Management": "Waste and Resource Management",
    "Sustainable Community Engagement": "Sustainable Community Engagement",
    "Construction and Design": "Construction and Design"
  };
  return categoryMap[cleaned] || "Sustainable Community Engagement";
}
const audienceMapping: Record<string, string> = {
  "S": "Students",
  "B": "Business Professionals",
  "G": "General Public"
};
const playerModeMapping: Record<string, string> = {
  "B": "Both",
  "M": "Multi Player",
  "S": "Single Player"
};
const purposeMapping: Record<string, string> = {
  "Pe": "Pedagogy",
  "Pu": "Persuasion",
  "Pa": "Participation"
};
const ageMapping: Record<string, string> = {
  "C": "Children",
  "A": "Adults"
};
function parseTechnology(techData: any): string[] {
  if (!techData) return ["Digital"];
  const tech = String(techData).toLowerCase().trim();
  if (tech.includes('n/a') || tech === '') {
    return ["Digital"];
  }
  if ((tech.includes('boardgame') || tech.includes('board game')) && (tech.includes('pc') || tech.includes('mobile') || tech.includes('ar') || tech.includes('vr'))) {
    return ["Hybrid"];
  }
  if (tech.includes('boardgame') || tech.includes('board game') || tech.includes('escape room') || tech === 'physical') {
    return ["Physical"];
  }
  if (tech.includes('vr') || tech.includes('ar') || tech.includes('xr')) {
    return ["Extended Reality (XR)"];
  }
  return ["Digital"];
}
function parseAudience(audienceData: any): string[] {
  if (!audienceData) return [];
  const mapped = audienceMapping[audienceData];
  return mapped ? [mapped] : [];
}
function parsePlayerMode(playerModeData: any): string[] {
  if (!playerModeData) return [];
  const mapped = playerModeMapping[playerModeData];
  return mapped ? [mapped] : [];
}
function parsePurpose(purposeData: any): string[] {
  if (!purposeData) return [];
  if (typeof purposeData === 'string' && purposeData.includes('/')) {
    const parts = purposeData.split('/').map(p => p.trim());
    const mappedParts = parts.map(p => purposeMapping[p]).filter(Boolean);
    const result = [...mappedParts];
    if (mappedParts.length > 1) {
      result.push(mappedParts.join(' & '));
    }
    return result;
  }
  const mapped = purposeMapping[purposeData];
  return mapped ? [mapped] : [];
}
function parseAge(ageData: any): string[] {
  if (!ageData) return [];
  const mapped = ageMapping[ageData];
  return mapped ? [mapped] : [];
}
function convertJsonToGameData(jsonItem: any, index: number): GameData {
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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];
const categoryColors = {
  "Urban Development and Planning": "#0088FE",
  "Energy Efficiency and Transition": "#00C49F",
  "Natural Hazards and Extreme Events": "#FFBB28",
  "Water Management": "#FF8042",
  "Waste and Resource Management": "#8884D8",
  "Sustainable Community Engagement": "#82CA9D",
  "Construction and Design": "#FFC658"
};
const purposeColors = {
  "Pedagogy": "#E74C3C",
  "Persuasion": "#3498DB",
  "Participation": "#F39C12",
  "Pedagogy & Persuasion": "#9B59B6",
  "Pedagogy & Participation": "#1ABC9C",
  "Persuasion & Participation": "#E67E22",
  "Pedagogy & Persuasion & Participation": "#2ECC71"
};
const chartConfig = {
  frequency: {
    label: "Frequency",
    color: "#0088FE"
  },
  count: {
    label: "Count",
    color: "#00C49F"
  }
};
export default function AnalyticsPage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try loading from raw GitHub content first, then GitHub Pages paths
        const possiblePaths = ['https://raw.githubusercontent.com/Z-Arghavan/SCUBEATLAS/main/forRepo_Data.json', 'https://z-arghavan.github.io/SCUBEATLAS/forRepo_Data.json', `${import.meta.env.BASE_URL}forRepo_Data.json`, './forRepo_Data.json', '/forRepo_Data.json'];
        let response;
        let dataLoaded = false;
        for (const path of possiblePaths) {
          try {
            console.log('Trying to fetch from:', path);
            response = await fetch(path);
            if (response.ok) {
              console.log('Successfully loaded from:', path);
              dataLoaded = true;
              break;
            }
          } catch (error) {
            console.log('Failed to fetch from:', path, error);
            continue;
          }
        }
        if (!dataLoaded || !response?.ok) {
          throw new Error(`Failed to load data from any path. Last status: ${response?.status || 'unknown'}`);
        }
        const text = await response.text();
        const cleanText = text.replace(/\bNaN\b/g, 'null');
        const jsonData = JSON.parse(cleanText);
        const convertedGames = jsonData.map(convertJsonToGameData);
        console.log('Loaded games:', convertedGames.length);
        setGames(convertedGames);
        setLoading(false);
      } catch (error) {
        console.error('Error loading game data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);
  if (loading) {
    return <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg text-gray-500">Loading analytics...</div>
        </div>
        <Footer />
      </main>;
  }

  // Calculate statistics
  const totalGames = games.length;

  // Category distribution
  const categoryData = games.reduce((acc, game) => {
    acc[game.category] = (acc[game.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.length > 15 ? category.substring(0, 15) + '...' : category,
    fullCategory: category,
    count,
    fill: categoryColors[category] || "#0088FE"
  }));

  // Year trends
  const yearData = games.reduce((acc, game) => {
    const year = game.year !== "Unknown" ? game.year : "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const yearChartData = Object.entries(yearData).filter(([year]) => year !== "Unknown").sort(([a], [b]) => Number(a) - Number(b)).map(([year, count]) => ({
    year,
    count
  }));

  // Technology distribution
  const technologyData = games.reduce((acc, game) => {
    game.technology.forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  const technologyChartData = Object.entries(technologyData).map(([technology, count]) => ({
    technology,
    count
  }));

  // Purpose distribution
  const purposeData = games.reduce((acc, game) => {
    game.purpose.forEach(purpose => {
      acc[purpose] = (acc[purpose] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  const purposeChartData = Object.entries(purposeData).map(([purpose, count]) => ({
    purpose,
    frequency: count,
    fill: purposeColors[purpose] || "#E74C3C"
  }));
  return <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">
          Serious Games Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-500 mb-6 text-center">Insights and trends from the sustainable and circular urban built environment (SCUBE) database</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Games</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{totalGames}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{Object.keys(categoryData).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Year Range</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg font-bold text-primary">
                {Math.min(...games.filter(g => g.year !== "Unknown").map(g => Number(g.year)))} - {Math.max(...games.filter(g => g.year !== "Unknown").map(g => Number(g.year)))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Technologies</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{Object.keys(technologyData).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Games by Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Serious Games per Theme</CardTitle>
              <CardDescription>Distribution of serious games</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 100
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" fontSize={10} angle={-45} textAnchor="end" height={100} />
                    <YAxis fontSize={10} label={{
                    value: 'Frequency',
                    angle: -90,
                    position: 'insideLeft'
                  }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Games by Year */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-950">Serious Games per year</CardTitle>
              <CardDescription>Timeline of the number of serious games published in academic outlets</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearChartData} margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" fontSize={10} />
                    <YAxis fontSize={10} label={{
                    value: 'Frequency',
                    angle: -90,
                    position: 'insideLeft'
                  }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Technology Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Serious Games per Technology</CardTitle>
              <CardDescription>Types of serious games</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={technologyChartData} cx="50%" cy="50%" labelLine={false} label={({
                    technology,
                    percent
                  }) => `${technology} ${(percent * 100).toFixed(0)}%`} outerRadius={60} fill="#8884d8" dataKey="count">
                      {technologyChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Purpose Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Serious Games per Purpose</CardTitle>
              <CardDescription>Mono, double, and triple Purposes of the serious games</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={purposeChartData} margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="purpose" fontSize={10} angle={-45} textAnchor="end" height={60} />
                    <YAxis fontSize={10} label={{
                    value: 'Frequency',
                    angle: -90,
                    position: 'insideLeft'
                  }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="frequency" fill="var(--color-frequency)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Citation Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Cite us or read more:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-700">
              <p className="mb-3">
                <span className="font-medium">1.</span> Akbarieh, A., Han, Q., & Klippel, A. (2025, June 9–10). Atlas of the serious games in the urban built environment. <em>2nd GeoGame Symposium</em>, Dublin.
              </p>
              <p>
                <span className="font-medium">2.</span> Akbarieh, A., Han, Q., & Klippel, A. (2025). Playing for a purpose: A systematic review and framework for gamified sustainability interventions in urban built environments. <em>Results in Engineering</em>, 105277. <a href="https://doi.org/10.1016/j.rineng.2025.105277" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://doi.org/10.1016/j.rineng.2025.105277</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>;
}
