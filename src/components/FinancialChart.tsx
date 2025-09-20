import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatINR } from "@/utils/currency";

interface ChartData {
  name: string;
  value?: number;
  profit?: number;
  loss?: number;
  revenue?: number;
  expenses?: number;
  forecast?: number;
  actual?: number;
  [key: string]: any;
}

interface FinancialChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'area' | 'pie';
  title: string;
  dataKeys: string[];
  colors?: string[];
  showGrid?: boolean;
  height?: number;
  className?: string;
}

const defaultColors = [
  'hsl(var(--primary))',
  'hsl(var(--profit))',
  'hsl(var(--loss))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border rounded-lg shadow-lg p-3 min-w-[200px]">
      <p className="font-medium text-sm mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">
              {entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <span className="font-medium">
            {formatINR(entry.value, { compact: true })}
          </span>
        </div>
      ))}
    </div>
  );
};

export const FinancialChart = ({
  data,
  type,
  title,
  dataKeys,
  colors = defaultColors,
  showGrid = true,
  height = 400,
  className = ""
}: FinancialChartProps) => {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="name" 
              className="text-xs text-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs text-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatINR(value, { compact: true, showSymbol: false })}
            />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300"
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="name" 
              className="text-xs text-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs text-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatINR(value, { compact: true, showSymbol: false })}
            />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, className: "drop-shadow-lg" }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="name" 
              className="text-xs text-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs text-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatINR(value, { compact: true, showSymbol: false })}
            />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              paddingAngle={5}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};