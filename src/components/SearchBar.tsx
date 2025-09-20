import { useState } from "react";
import { Search, Filter, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  onSearch: (query: string, filters: string[]) => void;
  placeholder?: string;
}

const searchSuggestions = [
  { text: "Monthly profit trend", icon: TrendingUp, category: "profit" },
  { text: "Marketing spend analysis", icon: BarChart3, category: "expenses" },
  { text: "Cash flow forecast", icon: TrendingUp, category: "forecast" },
  { text: "Revenue vs expenses", icon: BarChart3, category: "comparison" },
  { text: "Quarterly performance", icon: TrendingUp, category: "performance" },
  { text: "Cost reduction opportunities", icon: TrendingDown, category: "optimization" },
];

const filterOptions = [
  "All Data",
  "Profit & Loss",
  "Cash Flow",
  "Revenue",
  "Expenses",
  "Forecasts",
  "Monthly Reports",
  "Quarterly Reports"
];

export const SearchBar = ({ onSearch, placeholder = "Search financial statements, scenarios, or ask questions..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, selectedFilters);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion, selectedFilters);
    setShowSuggestions(false);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="flex gap-2 dashboard-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(query.length > 0)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="pl-10 pr-4 py-3 text-base border-muted-foreground/20 focus:border-primary transition-colors"
          />
          
          {/* Search Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 group"
                >
                  <suggestion.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm">{suggestion.text}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {suggestion.category}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-4 py-3 gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {selectedFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filterOptions.map((filter) => (
              <DropdownMenuItem
                key={filter}
                onClick={() => toggleFilter(filter)}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                  selectedFilters.includes(filter) ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`}>
                  {selectedFilters.includes(filter) && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                  )}
                </div>
                {filter}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSearch} className="px-6 py-3 bg-gradient-primary hover:shadow-glow transition-all">
          Search
        </Button>
      </div>

      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={() => toggleFilter(filter)}
            >
              {filter} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};