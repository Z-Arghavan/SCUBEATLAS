
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameData } from "@/components/GameCard";

// Helper functions from Index.tsx
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
    "Construction and Design": "Construction and Design",
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
  
  if ((tech.includes('boardgame') || tech.includes('board game')) && 
      (tech.includes('pc') || tech.includes('mobile') || tech.includes('ar') || tech.includes('vr'))) {
    return ["Hybrid"];
  }
  
  if (tech.includes('boardgame') || tech.includes('board game') || 
      tech.includes('escape room') || tech === 'physical') {
    return ["Physical"];
  }
  
  if (tech.includes('vr') || tech.includes('ar') || tech.includes('xr')) {
    return ["Virtual Reality (XR)"];
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

const chartConfig = {
  count: {
    label: "Count",
    color: "#0088FE",
  },
};

export default function AnalyticsPage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // GitHub Pages specific paths - try the most likely locations
        const possiblePaths = [
          './forRepo_Data.json',  // Same directory as index.html
          '/forRepo_Data.json',   // Root of domain
          `${import.meta.env.BASE_URL}forRepo_Data.json`, // Using Vite's base URL
          'https://z-arghavan.github.io/SCUBEATLAS/forRepo_Data.json' // Direct GitHub Pages URL
        ];
        
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
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg text-gray-500">Loading analytics...</div>
        </div>
        <Footer />
      </main>
    );
  }

  // Calculate statistics
  const totalGames = games.length;
  
  // Category distribution
  const categoryData = games.reduce((acc, game) => {
    acc[game.category] = (acc[game.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.length > 20 ? category.substring(0, 20) + '...' : category,
    fullCategory: category,
    count
  }));

  // Year trends
  const yearData = games.reduce((acc, game) => {
    const year = game.year !== "Unknown" ? game.year : "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const yearChartData = Object.entries(yearData)
    .filter(([year]) => year !== "Unknown")
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, count]) => ({ year, count }));

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
    count
  }));

  // Purpose to Theme (Category) flow data for Sankey-like visualization
  const purposeToThemeData = games.reduce((acc, game) => {
    game.purpose.forEach(purpose => {
      const key = `${purpose} → ${game.category}`;
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sankeyData = Object.entries(purposeToThemeData)
    .map(([flow, count], index) => {
      const [purpose, theme] = flow.split(' → ');
      return { 
        id: `sankey-${index}`, // Add unique ID
        flow, 
        purpose, 
        theme, 
        count 
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Show top 15 flows

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">
          Serious Games Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-500 mb-8 text-center">
          Insights and trends from the sustainable urban development games database
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalGames}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{Object.keys(categoryData).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Year Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">
                {Math.min(...games.filter(g => g.year !== "Unknown").map(g => Number(g.year)))} - {Math.max(...games.filter(g => g.year !== "Unknown").map(g => Number(g.year)))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{Object.keys(technologyData).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Purpose to Theme Flow */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Purpose to Theme Flow</CardTitle>
              <CardDescription>How educational purposes connect to sustainability themes (top connections)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sankeyData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="flow" 
                      fontSize={11}
                      width={200}
                    />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.purpose}</p>
                              <p className="text-sm text-muted-foreground">↓</p>
                              <p className="font-semibold">{data.theme}</p>
                              <p className="text-sm">Games: {data.count}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Games by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Games by Category</CardTitle>
              <CardDescription>Distribution of games across different sustainability categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Games by Year */}
          <Card>
            <CardHeader>
              <CardTitle>Games by Year</CardTitle>
              <CardDescription>Timeline showing the number of games published each year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Technology Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Distribution</CardTitle>
              <CardDescription>Types of technology platforms used in the games</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={technologyChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ technology, percent }) => `${technology} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {technologyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Purpose Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Game Purpose Distribution</CardTitle>
              <CardDescription>Educational purposes and goals of the games</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={purposeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="purpose" fontSize={12} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
