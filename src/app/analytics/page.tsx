"use client";

import { useState, useEffect } from "react";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data
const monthlyData = [
  { month: 'Jan', plastic: 45, paper: 60, glass: 30, metal: 25, electronic: 15, organic: 70 },
  { month: 'Feb', plastic: 50, paper: 55, glass: 35, metal: 20, electronic: 18, organic: 65 },
  { month: 'Mar', plastic: 60, paper: 70, glass: 40, metal: 30, electronic: 25, organic: 80 },
  { month: 'Apr', plastic: 70, paper: 65, glass: 45, metal: 35, electronic: 20, organic: 90 },
  { month: 'May', plastic: 65, paper: 60, glass: 50, metal: 40, electronic: 22, organic: 85 },
  { month: 'Jun', plastic: 80, paper: 70, glass: 55, metal: 45, electronic: 30, organic: 95 },
  { month: 'Jul', plastic: 75, paper: 80, glass: 60, metal: 50, electronic: 35, organic: 100 },
  { month: 'Aug', plastic: 90, paper: 85, glass: 65, metal: 55, electronic: 28, organic: 110 },
  { month: 'Sep', plastic: 85, paper: 90, glass: 70, metal: 60, electronic: 32, organic: 105 },
  { month: 'Oct', plastic: 95, paper: 95, glass: 75, metal: 65, electronic: 40, organic: 115 },
  { month: 'Nov', plastic: 100, paper: 100, glass: 80, metal: 70, electronic: 45, organic: 120 },
  { month: 'Dec', plastic: 110, paper: 110, glass: 85, metal: 75, electronic: 50, organic: 125 },
];

const wasteCompositionData = [
  { name: 'Plastic', value: 30, color: '#FF8042' },
  { name: 'Paper', value: 25, color: '#0088FE' },
  { name: 'Glass', value: 15, color: '#00C49F' },
  { name: 'Metal', value: 10, color: '#FFBB28' },
  { name: 'Electronic', value: 5, color: '#FF5733' },
  { name: 'Organic', value: 15, color: '#8BC34A' },
];

const recyclingRateData = [
  { month: 'Jan', rate: 58 },
  { month: 'Feb', rate: 60 },
  { month: 'Mar', rate: 62 },
  { month: 'Apr', rate: 65 },
  { month: 'May', rate: 68 },
  { month: 'Jun', rate: 70 },
  { month: 'Jul', rate: 72 },
  { month: 'Aug', rate: 73 },
  { month: 'Sep', rate: 75 },
  { month: 'Oct', rate: 78 },
  { month: 'Nov', rate: 80 },
  { month: 'Dec', rate: 82 },
];

const totalWasteByLocation = [
  { location: 'Main Facility', amount: 450 },
  { location: 'Office Building', amount: 320 },
  { location: 'Warehouse', amount: 280 },
  { location: 'Cafeteria', amount: 220 },
  { location: 'Workshop', amount: 180 },
  { location: 'IT Department', amount: 120 },
];

const kpiData = {
  totalWaste: "1,570 kg",
  recyclingRate: "76%",
  costSaving: "$12,450",
  carbonFootprintReduced: "324 kg CO2e"
};

export default function Analytics() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const [timeRange, setTimeRange] = useState("year");
  const [chartType, setChartType] = useState("overview");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Analytics", href: "/analytics" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-green-800">Waste Analytics</h1>
        
        <div className="flex gap-4">
          <Select defaultValue="year" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Waste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalWaste}</div>
            <p className="text-xs text-muted-foreground">+12% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recycling Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData.recyclingRate}</div>
            <p className="text-xs text-muted-foreground">+5% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpiData.costSaving}</div>
            <p className="text-xs text-muted-foreground">From waste reduction efforts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Carbon Footprint Reduced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{kpiData.carbonFootprintReduced}</div>
            <p className="text-xs text-muted-foreground">Equivalent to 15 trees planted</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mb-6">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setChartType}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="recycling">Recycling</TabsTrigger>
            <TabsTrigger value="location">By Location</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Charts */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>{
            chartType === "overview" ? "Waste Collection Trend" :
            chartType === "composition" ? "Waste Composition" :
            chartType === "recycling" ? "Recycling Rate Over Time" :
            "Waste by Location"
          }</CardTitle>
          <CardDescription>{
            chartType === "overview" ? "Monthly waste collection amounts by type" :
            chartType === "composition" ? "Breakdown of waste by material type" :
            chartType === "recycling" ? "Monthly recycling rate percentage" :
            "Total waste collected by location"
          }</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            {chartType === "overview" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="plastic" name="Plastic" stackId="a" fill="#FF8042" />
                  <Bar dataKey="paper" name="Paper" stackId="a" fill="#0088FE" />
                  <Bar dataKey="glass" name="Glass" stackId="a" fill="#00C49F" />
                  <Bar dataKey="metal" name="Metal" stackId="a" fill="#FFBB28" />
                  <Bar dataKey="electronic" name="Electronic" stackId="a" fill="#FF5733" />
                  <Bar dataKey="organic" name="Organic" stackId="a" fill="#8BC34A" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === "composition" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteCompositionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {wasteCompositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {chartType === "recycling" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={recyclingRateData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Recycling Rate"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Recycling Rate"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartType === "location" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={totalWasteByLocation}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="location" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip formatter={(value) => [`${value} kg`, "Amount"]} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Total Waste (kg)" 
                    fill="#00796B" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>AI-generated insights based on your waste data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-800">Recycling Rate Improving</h3>
              <p className="text-green-700">Your recycling rate has improved by 5% over the last period. Keep up the good work!</p>
            </div>
            
            <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800">Plastic Waste Increasing</h3>
              <p className="text-amber-700">Plastic waste has increased by 15% in the last quarter. Consider implementing reduction strategies.</p>
            </div>
            
            <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Cost Saving Opportunities</h3>
              <p className="text-blue-700">Implementing source separation could further increase your recycling rate and reduce disposal costs by up to 20%.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
