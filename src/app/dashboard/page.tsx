"use client";

import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import { useEffect } from "react";

export default function Dashboard() {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Waste Tracking Overview", href: "/dashboard" },
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-green-800">Waste Tracking Dashboard</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Add New Entry
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-medium text-gray-700">Total Waste Collected</h3>
          <p className="text-3xl font-bold text-green-600">1,245 kg</p>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-medium text-gray-700">Recycling Rate</h3>
          <p className="text-3xl font-bold text-blue-600">68%</p>
          <p className="text-sm text-gray-500">+5% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
          <h3 className="text-lg font-medium text-gray-700">Carbon Footprint Saved</h3>
          <p className="text-3xl font-bold text-amber-600">324 kg</p>
          <p className="text-sm text-gray-500">Equivalent to 15 trees planted</p>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Waste Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (kg)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">2025-06-04</td>
                <td className="px-4 py-3 whitespace-nowrap">Plastic</td>
                <td className="px-4 py-3 whitespace-nowrap">12.5</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Recycled</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">2025-06-03</td>
                <td className="px-4 py-3 whitespace-nowrap">Paper</td>
                <td className="px-4 py-3 whitespace-nowrap">8.2</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Recycled</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">2025-06-02</td>
                <td className="px-4 py-3 whitespace-nowrap">Electronic Waste</td>
                <td className="px-4 py-3 whitespace-nowrap">5.0</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Processing</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">2025-06-01</td>
                <td className="px-4 py-3 whitespace-nowrap">Glass</td>
                <td className="px-4 py-3 whitespace-nowrap">3.7</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Recycled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
