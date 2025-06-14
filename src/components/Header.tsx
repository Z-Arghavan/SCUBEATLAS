import { Link, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const navLinks = [{
  label: "Home",
  to: "/"
}, {
  label: "Analytics",
  to: "/analytics"
}];
export default function Header() {
  const location = useLocation();
  return <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex gap-4 justify-between items-center px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-primary">SCUBE Atlas</span>
          <nav className="hidden sm:flex gap-2 ml-5">
            {navLinks.map(link => <Link key={link.to} to={link.to} className={cn("px-3 py-1 rounded hover:bg-sky-50 transition text-sm", location.pathname === link.to && "bg-sky-100 font-semibold")}>
                {link.label}
              </Link>)}
            <a href="https://isbe.bwk.tue.nl/" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded hover:bg-sky-50 transition text-sm">
              About Us
            </a>
            
          </nav>
        </div>
        <div className="flex gap-2 items-center">
          <Button size="sm" onClick={() => window.open("https://github.com/Z-Arghavan/SCUBEATLAS/issues", "_blank")} variant="default" className="bg-green-500 text-white hover:bg-green-600">
            Submit a Game
          </Button>
        </div>
      </div>
    </header>;
}