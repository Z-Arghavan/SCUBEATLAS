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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

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
        // Updated GitHub repository URLs
        const possiblePaths = [
          'https://raw.githubusercontent.com/Z-Arghavan/SCUBEATLAS/main/forRepo_Data.json',
          'https://z-arghavan.github.io/SCUBEATLAS/forRepo_Data.json',
          './forRepo_Data.json',
          '/forRepo_Data.json'
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
          console.error(`Failed to load data from any path. Last status: ${response?.status || 'unknown'}`);
          // Set empty games array to show empty state instead of loading forever
          setGames([]);
          setLoading(false);
          return;
        }
        
        const text = await response.text();
        console.log('Raw response length:', text.length);
        const cleanText = text.replace(/\bNaN\b/g, 'null');
        const jsonData = JSON.parse(cleanText);
        console.log('Parsed JSON data length:', jsonData.length);
        const convertedGames = jsonData.map(convertJsonToGameData);
        console.log('Converted games:', convertedGames.length);
        setGames(convertedGames);
        setLoading(false);
      } catch (error) {
        console.error('Error loading game data:', error);
        setGames([]);
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

  if (games.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-lg text-gray-500 mb-2">No data available</div>
            <div className="text-sm text-gray-400">Unable to load analytics data. Please check the data source.</div>
          </div>
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

  const categoryChartData = Object.entries(categoryData).map(([category, count], index) => ({
    id: `category-${index}`,
    category: category.length > 20 ? category.substring(0, 20) + '...' : category,
    fullCategory: category,
    count,
    fill: COLORS[index % COLORS.length]
  }));

  console.log('Category chart data:', categoryChartData);

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

  const technologyChartData = Object.entries(technologyData).map(([technology, count], index) => ({
    technology,
    count,
    fill: COLORS[index % COLORS.length]
  }));

  // Purpose distribution
  const purposeData = games.reduce((acc, game) => {
    game.purpose.forEach(purpose => {
      acc[purpose] = (acc[purpose] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const purposeChartData = Object.entries(purposeData).map(([purpose, count], index) => ({
    id: `purpose-${index}`,
    purpose,
    count,
    fill: COLORS[index % COLORS.length]
  }));

  console.log('Purpose chart data:', purposeChartData);

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
        id: `sankey-${index}`,
        flow, 
        purpose, 
        theme, 
        count 
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-sky-50 to-green-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">
          Serious Games Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-500 mb-6 text-center">
          Insights and trends from the sustainable urban development games database
        </p>

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

        {/* Purpose to Theme Flow */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Purpose to Theme Flow</CardTitle>
              <CardDescription>How educational purposes connect to sustainability themes (top connections)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sankeyData} layout="horizontal" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="flow" 
                      fontSize={10}
                      width={140}
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
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Games by Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Games by Category</CardTitle>
              <CardDescription>Distribution of games across different sustainability categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={categoryChartData} 
                    layout="horizontal" 
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={10} />
                    <YAxis 
                      type="category"
                      dataKey="category" 
                      fontSize={10}
                      width={110}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count">
                      {categoryChartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Games by Year */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Games by Year</CardTitle>
              <CardDescription>Timeline showing the number of games published each year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" fontSize={10} />
                    <YAxis fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Technology Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Technology Distribution</CardTitle>
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
                        <Cell key={`tech-cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Game Purpose Distribution</CardTitle>
              <CardDescription>Educational purposes and goals of the games</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={purposeChartData} 
                    layout="horizontal" 
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={10} />
                    <YAxis 
                      type="category"
                      dataKey="purpose" 
                      fontSize={10}
                      width={70}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count">
                      {purposeChartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.fill} />
                      ))}
                    </Bar>
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
