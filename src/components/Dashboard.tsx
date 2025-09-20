import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Users,
  PieChart,
  Activity,
  Calendar
} from "lucide-react";
import { SearchBar } from "./SearchBar";
import { MetricCard } from "./MetricCard";
import { FinancialChart } from "./FinancialChart";
import { ScenarioPlanner } from "./ScenarioPlanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock financial data
const mockData = {
  monthlyMetrics: {
    revenue: 450000,
    previousRevenue: 380000,
    expenses: 320000,
    previousExpenses: 290000,
    profit: 130000,
    previousProfit: 90000,
    cashFlow: 180000,
    marketingSpend: 75000,
    employees: 8,
  },
  
  monthlyTrends: [
    { name: 'Jan', revenue: 280000, expenses: 220000, profit: 60000 },
    { name: 'Feb', revenue: 320000, expenses: 240000, profit: 80000 },
    { name: 'Mar', revenue: 350000, expenses: 260000, profit: 90000 },
    { name: 'Apr', revenue: 380000, expenses: 290000, profit: 90000 },
    { name: 'May', revenue: 420000, expenses: 310000, profit: 110000 },
    { name: 'Jun', revenue: 450000, expenses: 320000, profit: 130000 },
  ],
  
  revenueBreakdown: [
    { name: 'Product Sales', value: 280000 },
    { name: 'Services', value: 120000 },
    { name: 'Subscriptions', value: 50000 },
  ],
  
  expenseBreakdown: [
    { name: 'Salaries', value: 180000 },
    { name: 'Marketing', value: 75000 },
    { name: 'Operations', value: 45000 },
    { name: 'Others', value: 20000 },
  ],
  
  cashFlowForecast: [
    { name: 'Jul', forecast: 160000, actual: 130000 },
    { name: 'Aug', forecast: 180000, actual: 0 },
    { name: 'Sep', forecast: 200000, actual: 0 },
    { name: 'Oct', forecast: 220000, actual: 0 },
    { name: 'Nov', forecast: 240000, actual: 0 },
    { name: 'Dec', forecast: 260000, actual: 0 },
  ],
};

export const Dashboard = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSearch = (query: string, filters: string[]) => {
    // Enhanced mock search functionality with more detailed results
    const mockResults = [
      {
        type: "insight",
        title: `Financial Analysis for "${query}"`,
        content: "Based on your search, here are the key findings:",
        details: [
          "Revenue trends show 18.4% growth over last 6 months",
          "Marketing ROI: ₹6.2 revenue per ₹1 spent",
          "Current monthly burn rate: ₹3.2L",
          "Projected profitability: Next 3 months"
        ]
      },
      {
        type: "chart",
        title: "Related Financial Data",
        content: "Key metrics matching your search:",
        details: [
          "Monthly Revenue: ₹4.5L (↑18% vs last month)",
          "Net Profit Margin: 28.9% (↑5.2% vs last month)",
          "Cash Flow: ₹1.8L positive",
          "Marketing Spend Efficiency: Above industry average"
        ]
      },
      {
        type: "recommendation",
        title: "AI Recommendations",
        content: "Based on your financial patterns:",
        details: [
          "💡 Consider increasing marketing budget by 20% for optimal ROI",
          "📈 Revenue growth trajectory suggests hiring 2 more team members",
          "⚠️ Monitor expenses - trending 10% higher than forecasted",
          "🎯 On track to exceed quarterly targets by 15%"
        ]
      }
    ];
    
    setSearchResults(mockResults);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('search-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CFO Helper Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Your intelligent financial planning assistant
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                June 2024
              </Button>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} />
          
          {/* Enhanced Search Results */}
          {searchResults.length > 0 && (
            <div id="search-results" className="mt-6 space-y-4 fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Search Results
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSearchResults([])}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Results
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="dashboard-card hover:shadow-glow transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        result.type === 'insight' ? 'bg-primary/10 text-primary' :
                        result.type === 'chart' ? 'bg-profit/10 text-profit' :
                        'bg-accent text-accent-foreground'
                      }`}>
                        {result.type === 'insight' ? <BarChart3 className="h-4 w-4" /> :
                         result.type === 'chart' ? <TrendingUp className="h-4 w-4" /> :
                         <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{result.title}</h4>
                        <p className="text-xs text-muted-foreground">{result.content}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {result.details.map((detail: string, detailIndex: number) => (
                        <div key={detailIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span className="text-foreground leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                    
                    {result.type === 'recommendation' && (
                      <div className="mt-4 pt-3 border-t border-muted/20">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Apply Recommendations
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="dashboard-card bg-accent/30 border-accent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Need more specific insights?</p>
                    <p className="text-xs text-muted-foreground">Try searching for specific metrics like "cash flow Q2" or "marketing ROI trends"</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Advanced Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="forecasts" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Forecasts
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-2">
              <Activity className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Monthly Revenue"
                value={mockData.monthlyMetrics.revenue}
                previousValue={mockData.monthlyMetrics.previousRevenue}
                icon={TrendingUp}
                format="currency"
                description="Total revenue this month"
                trend="up"
              />
              
              <MetricCard
                title="Monthly Expenses"
                value={mockData.monthlyMetrics.expenses}
                previousValue={mockData.monthlyMetrics.previousExpenses}
                icon={CreditCard}
                format="currency"
                description="Total expenses this month"
                trend="up"
              />
              
              <MetricCard
                title="Net Profit"
                value={mockData.monthlyMetrics.profit}
                previousValue={mockData.monthlyMetrics.previousProfit}
                icon={DollarSign}
                format="currency"
                description="Profit after all expenses"
                trend="up"
              />
              
              <MetricCard
                title="Team Size"
                value={mockData.monthlyMetrics.employees}
                icon={Users}
                format="number"
                description="Current employees"
                trend="stable"
              />
            </div>

            {/* Revenue vs Expenses Chart */}
            <FinancialChart
              data={mockData.monthlyTrends}
              type="bar"
              title="Monthly Revenue vs Expenses"
              dataKeys={['revenue', 'expenses', 'profit']}
              colors={['hsl(var(--primary))', 'hsl(var(--loss))', 'hsl(var(--profit))']}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart
                data={mockData.revenueBreakdown}
                type="pie"
                title="Revenue Breakdown"
                dataKeys={['value']}
                height={350}
              />
              
              <FinancialChart
                data={mockData.expenseBreakdown}
                type="pie"
                title="Expense Breakdown"
                dataKeys={['value']}
                height={350}
              />
            </div>
            
            <FinancialChart
              data={mockData.monthlyTrends}
              type="line"
              title="Profit Trend Analysis"
              dataKeys={['profit']}
              colors={['hsl(var(--profit))']}
            />
          </TabsContent>

          <TabsContent value="forecasts" className="space-y-6">
            <FinancialChart
              data={mockData.cashFlowForecast}
              type="area"
              title="Cash Flow Forecast - Next 6 Months"
              dataKeys={['forecast', 'actual']}
              colors={['hsl(var(--primary))', 'hsl(var(--profit))']}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Projected Revenue (6M)"
                value={2700000}
                icon={TrendingUp}
                format="currency"
                description="Next 6 months forecast"
                compact
              />
              
              <MetricCard
                title="Cash Runway"
                value={18}
                icon={Activity}
                format="number"
                description="Months at current burn rate"
                compact
              />
              
              <MetricCard
                title="Break-even Target"
                value={580000}
                icon={DollarSign}
                format="currency"
                description="Monthly revenue needed"
                compact
              />
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <ScenarioPlanner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};