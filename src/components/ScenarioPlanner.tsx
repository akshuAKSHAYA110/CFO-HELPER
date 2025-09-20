import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Download,
  Zap,
  Target
} from "lucide-react";
import { formatINR, formatPercentage } from "@/utils/currency";
import { MetricCard } from "./MetricCard";

interface ScenarioState {
  employees: number;
  marketingSpend: number;
  priceIncrease: number;
  additionalRevenue: number;
}

interface ScenarioResults {
  monthlyBurn: number;
  runwayMonths: number;
  projectedProfit: number;
  breakEvenMonth: number;
  totalRevenue: number;
  totalExpenses: number;
}

export const ScenarioPlanner = () => {
  const [scenario, setScenario] = useState<ScenarioState>({
    employees: 5,
    marketingSpend: 50000,
    priceIncrease: 0,
    additionalRevenue: 0,
  });

  const [results, setResults] = useState<ScenarioResults>({
    monthlyBurn: 0,
    runwayMonths: 0,
    projectedProfit: 0,
    breakEvenMonth: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  });

  const [scenarioCount, setScenarioCount] = useState(0);

  // Base assumptions
  const baseMetrics = {
    currentRevenue: 300000, // ₹3L per month
    employeeCost: 60000, // ₹60K per employee per month
    fixedCosts: 80000, // ₹80K fixed costs
    currentCash: 2000000, // ₹20L current cash
    revenuePerEmployee: 50000, // Additional revenue per new employee
  };

  useEffect(() => {
    calculateScenario();
    setScenarioCount(prev => prev + 1);
  }, [scenario]);

  const calculateScenario = () => {
    const { employees, marketingSpend, priceIncrease, additionalRevenue } = scenario;
    
    // Calculate monthly expenses
    const employeesCost = employees * baseMetrics.employeeCost;
    const totalExpenses = employeesCost + baseMetrics.fixedCosts + marketingSpend;
    
    // Calculate revenue with price increase and additional revenue
    const priceAdjustedRevenue = baseMetrics.currentRevenue * (1 + priceIncrease / 100);
    const employeeRevenueBoost = Math.max(0, employees - 5) * baseMetrics.revenuePerEmployee;
    const totalRevenue = priceAdjustedRevenue + employeeRevenueBoost + additionalRevenue;
    
    // Calculate key metrics
    const monthlyBurn = totalExpenses - totalRevenue;
    const runwayMonths = monthlyBurn > 0 ? Math.floor(baseMetrics.currentCash / monthlyBurn) : Infinity;
    const projectedProfit = totalRevenue - totalExpenses;
    const breakEvenMonth = monthlyBurn > 0 ? Math.ceil(baseMetrics.currentCash / Math.abs(monthlyBurn)) : 0;

    setResults({
      monthlyBurn: Math.abs(monthlyBurn),
      runwayMonths,
      projectedProfit,
      breakEvenMonth,
      totalRevenue,
      totalExpenses,
    });
  };

  const exportReport = () => {
    const report = {
      scenario: {
        employees: scenario.employees,
        marketingSpend: formatINR(scenario.marketingSpend),
        priceIncrease: formatPercentage(scenario.priceIncrease),
        additionalRevenue: formatINR(scenario.additionalRevenue),
      },
      results: {
        totalRevenue: formatINR(results.totalRevenue),
        totalExpenses: formatINR(results.totalExpenses),
        monthlyProfit: formatINR(results.projectedProfit),
        runwayMonths: results.runwayMonths,
        breakEvenMonth: results.breakEvenMonth,
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-scenario-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Calculator className="h-6 w-6 text-primary" />
            CFO Helper - Scenario Planner
          </h2>
          <p className="text-muted-foreground mt-1">
            Simulate budget scenarios and see clear outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            {scenarioCount} scenarios tested
          </Badge>
          <Button onClick={exportReport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Controls */}
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Scenario Inputs
            </h3>
          </div>

          {/* Employee Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employees
              </label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {scenario.employees}
              </span>
            </div>
            <Slider
              value={[scenario.employees]}
              onValueChange={([value]) => setScenario(prev => ({ ...prev, employees: value }))}
              max={20}
              min={1}
              step={1}
              className="transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Current: {scenario.employees} employees (₹{formatINR(scenario.employees * baseMetrics.employeeCost, { showSymbol: false, compact: true })}/month)
            </p>
          </div>

          <Separator />

          {/* Marketing Spend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Marketing Spend
              </label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {formatINR(scenario.marketingSpend, { compact: true })}
              </span>
            </div>
            <Slider
              value={[scenario.marketingSpend]}
              onValueChange={([value]) => setScenario(prev => ({ ...prev, marketingSpend: value }))}
              max={200000}
              min={0}
              step={5000}
              className="transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Monthly marketing budget allocation
            </p>
          </div>

          <Separator />

          {/* Price Increase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Increase
              </label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {formatPercentage(scenario.priceIncrease)}
              </span>
            </div>
            <Slider
              value={[scenario.priceIncrease]}
              onValueChange={([value]) => setScenario(prev => ({ ...prev, priceIncrease: value }))}
              max={50}
              min={-20}
              step={1}
              className="transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Percentage change in pricing
            </p>
          </div>

          <Separator />

          {/* Additional Revenue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Additional Revenue
              </label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {formatINR(scenario.additionalRevenue, { compact: true })}
              </span>
            </div>
            <Slider
              value={[scenario.additionalRevenue]}
              onValueChange={([value]) => setScenario(prev => ({ ...prev, additionalRevenue: value }))}
              max={500000}
              min={0}
              step={10000}
              className="transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Extra monthly revenue from new initiatives
            </p>
          </div>
        </Card>

        {/* Results - Key Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Monthly Profit/Loss"
            value={results.projectedProfit}
            icon={results.projectedProfit >= 0 ? TrendingUp : TrendingDown}
            format="currency"
            description="Net monthly cash flow"
            trend={results.projectedProfit > 0 ? 'up' : results.projectedProfit < 0 ? 'down' : 'stable'}
          />

          <MetricCard
            title="Runway"
            value={results.runwayMonths}
            icon={Target}
            format="number"
            description={`${results.runwayMonths === Infinity ? 'Profitable' : 'Months until cash runs out'}`}
            trend={results.runwayMonths > 12 ? 'up' : results.runwayMonths < 6 ? 'down' : 'stable'}
          />

          <MetricCard
            title="Total Revenue"
            value={results.totalRevenue}
            icon={TrendingUp}
            format="currency"
            description="Monthly revenue projection"
            previousValue={baseMetrics.currentRevenue}
          />

          <MetricCard
            title="Total Expenses"
            value={results.totalExpenses}
            icon={DollarSign}
            format="currency"
            description="Monthly expense projection"
            previousValue={baseMetrics.fixedCosts + (5 * baseMetrics.employeeCost) + 50000}
          />
        </div>
      </div>

      {/* Quick Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="font-medium mb-2">💡 Hiring Impact</p>
            <p className="text-muted-foreground">
              {scenario.employees > 5 
                ? `Adding ${scenario.employees - 5} employees will cost ₹${formatINR((scenario.employees - 5) * baseMetrics.employeeCost, { showSymbol: false, compact: true })}/month but could generate ₹${formatINR((scenario.employees - 5) * baseMetrics.revenuePerEmployee, { showSymbol: false, compact: true })}/month in additional revenue.`
                : "Current team size is optimal. Consider scaling when revenue exceeds ₹5L/month."
              }
            </p>
          </div>
          
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="font-medium mb-2">📈 Revenue Growth</p>
            <p className="text-muted-foreground">
              {scenario.priceIncrease > 0 
                ? `A ${formatPercentage(scenario.priceIncrease)} price increase adds ₹${formatINR(baseMetrics.currentRevenue * (scenario.priceIncrease / 100), { showSymbol: false, compact: true })}/month revenue.`
                : scenario.priceIncrease < 0
                ? `Price reduction of ${formatPercentage(Math.abs(scenario.priceIncrease))} reduces revenue by ₹${formatINR(baseMetrics.currentRevenue * (Math.abs(scenario.priceIncrease) / 100), { showSymbol: false, compact: true })}/month.`
                : "No pricing changes. Consider testing 5-10% increases."
              }
            </p>
          </div>
          
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="font-medium mb-2">🎯 Break-even</p>
            <p className="text-muted-foreground">
              {results.projectedProfit >= 0 
                ? "🎉 This scenario is profitable! You're generating positive cash flow."
                : results.runwayMonths > 12 
                ? `You have ${results.runwayMonths} months to reach profitability.`
                : results.runwayMonths < 6 
                ? "⚠️ Critical: Less than 6 months runway. Consider reducing costs or increasing revenue."
                : "Moderate runway. Focus on growth initiatives."
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};