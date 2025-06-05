"use client";

import { useState, useEffect } from "react";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for waste entries
const mockWasteEntries = [
  {
    id: 1,
    date: "2025-06-04",
    wasteType: "Plastic",
    category: "Recyclable",
    amount: 12.5,
    unit: "kg",
    location: "Main Facility",
    status: "Recycled",
    notes: "PET bottles and containers"
  },
  {
    id: 2,
    date: "2025-06-03",
    wasteType: "Paper",
    category: "Recyclable",
    amount: 8.2,
    unit: "kg",
    location: "Office Building",
    status: "Recycled",
    notes: "Office paper and cardboard"
  },
  {
    id: 3,
    date: "2025-06-02",
    wasteType: "Electronic Waste",
    category: "Hazardous",
    amount: 5.0,
    unit: "kg",
    location: "IT Department",
    status: "Processing",
    notes: "Old computers and peripherals"
  },
  {
    id: 4,
    date: "2025-06-01",
    wasteType: "Glass",
    category: "Recyclable",
    amount: 3.7,
    unit: "kg",
    location: "Cafeteria",
    status: "Recycled",
    notes: "Bottles and jars"
  },
  {
    id: 5,
    date: "2025-05-31",
    wasteType: "Organic",
    category: "Compostable",
    amount: 15.3,
    unit: "kg",
    location: "Cafeteria",
    status: "Composted",
    notes: "Food waste and biodegradable materials"
  },
  {
    id: 6,
    date: "2025-05-30",
    wasteType: "Metal",
    category: "Recyclable",
    amount: 6.2,
    unit: "kg",
    location: "Workshop",
    status: "Recycled",
    notes: "Aluminum cans and scrap metal"
  }
];

const wasteTypes = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Electronic Waste",
  "Organic",
  "Hazardous",
  "Mixed",
  "Other"
];

const wasteCategories = [
  "Recyclable",
  "Compostable",
  "Hazardous",
  "Landfill",
  "Special Handling"
];

const locations = [
  "Main Facility",
  "Office Building",
  "Warehouse",
  "Cafeteria",
  "Workshop",
  "IT Department",
  "Other"
];

export default function WasteEntries() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entries, setEntries] = useState(mockWasteEntries);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().slice(0, 10),
    wasteType: "",
    category: "",
    amount: 0,
    unit: "kg",
    location: "",
    status: "Processing",
    notes: ""
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Waste Entries", href: "/waste-entries" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add new entry to list (in a real app, this would be an API call)
    const newId = Math.max(...entries.map(entry => entry.id)) + 1;
    setEntries([{...newEntry, id: newId}, ...entries]);
    
    // Close dialog and reset form
    setDialogOpen(false);
    setNewEntry({
      date: new Date().toISOString().slice(0, 10),
      wasteType: "",
      category: "",
      amount: 0,
      unit: "kg",
      location: "",
      status: "Processing",
      notes: ""
    });
  };

  // Filter entries based on active tab and search term
  const filteredEntries = entries.filter(entry => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "recyclable" && entry.category === "Recyclable") ||
                      (activeTab === "hazardous" && entry.category === "Hazardous") ||
                      (activeTab === "compostable" && entry.category === "Compostable");
    
    const matchesSearch = searchTerm === "" || 
                         entry.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-green-800">Waste Entries</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">Add New Entry</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Waste Entry</DialogTitle>
                <DialogDescription>
                  Enter the details of the waste collection. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newEntry.date} 
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="amount" 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={newEntry.amount} 
                        onChange={(e) => setNewEntry({...newEntry, amount: parseFloat(e.target.value)})}
                        required 
                        className="flex-1"
                      />
                      <Select 
                        value={newEntry.unit} 
                        onValueChange={(value) => setNewEntry({...newEntry, unit: value})}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="tons">tons</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wasteType">Waste Type</Label>
                    <Select 
                      value={newEntry.wasteType} 
                      onValueChange={(value) => setNewEntry({...newEntry, wasteType: value})}
                      required
                    >
                      <SelectTrigger id="wasteType">
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newEntry.category} 
                      onValueChange={(value) => setNewEntry({...newEntry, category: value})}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select 
                    value={newEntry.location} 
                    onValueChange={(value) => setNewEntry({...newEntry, location: value})}
                    required
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    value={newEntry.notes} 
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})} 
                    placeholder="Additional details about the waste"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Entry</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="recyclable">Recyclable</TabsTrigger>
            <TabsTrigger value="hazardous">Hazardous</TabsTrigger>
            <TabsTrigger value="compostable">Compostable</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="w-full md:w-80">
          <Input 
            placeholder="Search entries..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{entry.wasteType}</CardTitle>
                    <CardDescription>{entry.date} • {entry.location}</CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${entry.status === 'Recycled' ? 'bg-green-100 text-green-800' : 
                      entry.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      entry.status === 'Composted' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`
                  }>
                    {entry.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{entry.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">{entry.amount} {entry.unit}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Notes</p>
                    <p className="font-medium">{entry.notes}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No waste entries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
