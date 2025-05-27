
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DEF_TECHS = ["XR", "PC", "Physical", "Hybrid"];
const DEF_AGES = ["Children", "Adults"];
const DEF_PURPOSE = [
  "Pedagogy",
  "Persuasion",
  "Participation",
  "Pedagogy & Persuasion",
  "Pedagogy & Participation",
  "Persuasion & Participation",
  "All",
];

export default function SubmitGamePage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
    category: "",
    technology: [] as string[],
    age: [] as string[],
    purpose: [] as string[],
    link: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function toggleArr(field: "technology" | "age" | "purpose", val: string) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val]
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate submit
    setSubmitted(true);
    toast({
      title: "Game submitted!",
      description:
        "Thanks for submitting. Your game will be reviewed and added soon.",
      variant: "success",
    });
    // Here you would call an API or integrate with Supabase/GitHub once set up
    setForm({
      title: "",
      description: "",
      year: "",
      category: "",
      technology: [],
      age: [],
      purpose: [],
      link: "",
    });
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Submit a Game</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Title</label>
          <Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="font-medium">Description</label>
          <textarea
            required
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="font-medium">Year</label>
          <Input required value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g., 2024" />
        </div>
        <div>
          <label className="font-medium">Category</label>
          <Input required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g., Architecture" />
        </div>
        <div>
          <label className="font-medium mb-2 block">Technology</label>
          <div className="flex flex-wrap gap-2">
            {DEF_TECHS.map(opt => (
              <label key={opt} className="text-sm flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={form.technology.includes(opt)}
                  onChange={() => toggleArr("technology", opt)}
                /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-medium mb-2 block">Age</label>
          <div className="flex flex-wrap gap-2">
            {DEF_AGES.map(opt => (
              <label key={opt} className="text-sm flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={form.age.includes(opt)}
                  onChange={() => toggleArr("age", opt)}
                /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-medium mb-2 block">Purpose</label>
          <div className="flex flex-wrap gap-2">
            {DEF_PURPOSE.map(opt => (
              <label key={opt} className="text-sm flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={form.purpose.includes(opt)}
                  onChange={() => toggleArr("purpose", opt)}
                /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-medium">External Link</label>
          <Input value={form.link} type="url" onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
        </div>
        <Button type="submit" className="w-full" disabled={submitted}>
          {submitted ? "Submitted!" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
