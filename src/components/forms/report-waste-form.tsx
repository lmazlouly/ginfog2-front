"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  AlertTriangle, 
  Camera, 
  User, 
  Phone, 
  Mail, 
  TreePine,
  Upload,
  X,
  Save,
  Trash2,
  CheckCircle,
  LocateIcon
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Updated API imports
import { useCreateWasteReport } from "@/lib/api/generated/waste-reports/waste-reports";
import { useGetUserById } from "@/lib/api/generated/users/users";
import type { BodyCreateWasteReport } from "@/lib/api/models/bodyCreateWasteReport";
import { WasteType } from "@/lib/api/models/wasteType";
import { UrgencyLevel } from "@/lib/api/models/urgencyLevel";
import { useAuth } from "@/providers/auth-provider";

// Form validation schema
const formSchema = z.object({
  // Location section
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  gpsCoordinates: z.string().optional(),
  
  // Waste details section
  wasteType: z.nativeEnum(WasteType, { required_error: "Please select a waste type" }),
  quantity: z.enum(["small", "medium", "large", "very_large"], {
    required_error: "Please select a quantity estimate",
  }),
  urgencyLevel: z.nativeEnum(UrgencyLevel, { required_error: "Please select an urgency level" }),
  
  // Additional information
  description: z.string().optional(),
  photos: z.array(z.instanceof(File)).optional(),
  
  // Contact information
  reporterName: z.string().min(1, { message: "Reporter name is required" }),
  phoneNumber: z.string().optional(),
  email: z.string().email({ message: "Valid email is required" }),
});

type FormValues = z.infer<typeof formSchema>;

// Default waste types (fallback if API doesn't exist)
const DEFAULT_WASTE_TYPES = [
  { value: WasteType.household, label: "Household Waste" },
  { value: WasteType.recyclable, label: "Recyclable Materials" },
  { value: WasteType.organic, label: "Organic/Compost" },
  { value: WasteType.electronic, label: "Electronic Waste" },
  { value: WasteType.hazardous, label: "Hazardous Materials" },
  { value: WasteType.construction, label: "Construction Debris" },
  { value: WasteType.illegal_dumping, label: "Bulky Items" },
  { value: WasteType.other, label: "Other" },
];

const QUANTITY_OPTIONS = [
  { 
    value: "small", 
    label: "Small (bags/few items)", 
    description: "A few bags or small items"
  },
  { 
    value: "medium", 
    label: "Medium (cart load)", 
    description: "About a shopping cart full"
  },
  { 
    value: "large", 
    label: "Large (truck load)", 
    description: "Requires a pickup truck"
  },
  { 
    value: "very_large", 
    label: "Very Large (multiple trucks)", 
    description: "Requires multiple vehicles"
  },
];

const URGENCY_OPTIONS = [
  { 
    value: UrgencyLevel.low, 
    label: "Low - Can wait a week", 
    color: "bg-green-100 text-green-800"
  },
  { 
    value: UrgencyLevel.medium, 
    label: "Medium - Should be collected within 3 days", 
    color: "bg-yellow-100 text-yellow-800"
  },
  { 
    value: UrgencyLevel.high, 
    label: "High - Needs immediate attention", 
    color: "bg-orange-100 text-orange-800"
  },
  { 
    value: UrgencyLevel.critical, 
    label: "Critical - Health/safety hazard", 
    color: "bg-red-100 text-red-800"
  },
];

export function ReportWasteForm() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // API hooks
  const createWasteReportMutation = useCreateWasteReport();
  const { data: userProfile, isLoading: userLoading } = useGetUserById(
    (user && user.id) || 0,
    { query: { enabled: !!user } }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetAddress: "",
      city: "",
      postalCode: "",
      gpsCoordinates: "",
      wasteType: undefined,
      quantity: undefined,
      urgencyLevel: undefined,
      description: "",
      photos: [],
      reporterName: "",
      phoneNumber: "",
      email: "",
    },
  });

  // Auto-fill user information when profile loads
  React.useEffect(() => {
    if (userProfile && !userLoading) {
      form.setValue("reporterName", userProfile.username || "");
      form.setValue("email", userProfile.email || "");
      // Auto-fill city if available in user profile
      // form.setValue("city", userProfile.city || "");
    }
  }, [userProfile, userLoading, form]);

  // Calculate form completion progress
  const calculateProgress = useCallback(() => {
    const values = form.getValues();
    const requiredFields = [
      "streetAddress", 
      "city", 
      "postalCode", 
      "wasteType", 
      "quantity", 
      "urgencyLevel", 
      "reporterName", 
      "email"
    ];
    
    const completedFields = requiredFields.filter(field => 
      values[field as keyof FormValues]
    ).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  }, [form]);

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const subscription = form.watch(() => {
      setProgress(calculateProgress());
    });
    return () => subscription.unsubscribe();
  }, [form, calculateProgress]);

  // Handle GPS location
  const handleGetLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
      });
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("gpsCoordinates", `${latitude}, ${longitude}`);
        toast({
          title: "Location captured",
          description: "GPS coordinates have been added to your report.",
        });
        setGettingLocation(false);
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location error",
          description: "Unable to get your location. Please try again.",
        });
        setGettingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} must be smaller than 10MB.`,
        });
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    form.setValue("photos", [...uploadedFiles, ...validFiles]);
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    form.setValue("photos", newFiles);
  };

  // Transform form data to API format
  const transformFormData = (data: FormValues): BodyCreateWasteReport => {
    // Parse GPS coordinates if available
    let latitude: number | undefined;
    let longitude: number | undefined;
    
    if (data.gpsCoordinates) {
      const coords = data.gpsCoordinates.split(", ");
      if (coords.length === 2) {
        latitude = parseFloat(coords[0]);
        longitude = parseFloat(coords[1]);
      }
    }

    return {
      street_address: data.streetAddress,
      city: data.city,
      postal_code: data.postalCode,
      latitude: latitude,
      longitude: longitude,
      waste_type: data.wasteType!,
      quantity_estimate: data.quantity!,
      urgency_level: data.urgencyLevel!,
      description: data.description || undefined,
      reporter_name: data.reporterName,
      reporter_phone: data.phoneNumber || undefined,
      photos: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };
  };

  // Submit form
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = transformFormData(data);

      await createWasteReportMutation.mutateAsync({ data: payload });
      
      toast({
        title: "Report submitted successfully!",
        description: "Thank you for helping keep our community clean.",
      });

      // Reset form and navigate
      form.reset();
      setUploadedFiles([]);
      router.push("/client/waste-entries");
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error?.message || "Failed to submit report. Please try again.",
      });
    }
  };

  // Save as draft (stub implementation)
  const handleSaveDraft = () => {
    setIsDraft(true);
    // TODO: Implement draft saving when API is available
    toast({
      title: "Draft saved",
      description: "Your report has been saved as a draft.",
    });
    setTimeout(() => setIsDraft(false), 1000);
  };

  // Clear form
  const handleClearForm = () => {
    form.reset();
    setUploadedFiles([]);
    toast({
      title: "Form cleared",
      description: "All form data has been cleared.",
    });
  };

  const isLoading = createWasteReportMutation.isPending;
  const canSubmit = progress === 100 && !isLoading;

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Trash2 className="h-8 w-8 text-green-600" />
          Report New Waste
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help keep our community clean by reporting waste issues
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Form Completion</CardTitle>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Location Details
              </CardTitle>
              <CardDescription>
                Provide the location where the waste was found
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the street address"
                        {...field}
                        className="focus:ring-2 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City name"
                          {...field}
                          className="focus:ring-2 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Postal/ZIP code"
                          {...field}
                          className="focus:ring-2 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gpsCoordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Coordinates (Optional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Latitude, Longitude"
                          {...field}
                          className="focus:ring-2 focus:ring-green-500"
                          readOnly
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGetLocation}
                        disabled={gettingLocation}
                        className="shrink-0"
                      >
                        {gettingLocation ? (
                          <LocateIcon className="h-4 w-4 animate-spin border-2 border-gray-200 rounded-full border-t-gray-600" />
                        ) : (
                          <LocateIcon className="h-4 w-4" />
                        )}
                        Use My Location
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Waste Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-green-600" />
                Waste Details
              </CardTitle>
              <CardDescription>
                Describe the type and amount of waste found
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="wasteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-green-500">
                          <SelectValue placeholder="Select waste type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEFAULT_WASTE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Quantity Estimate *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {QUANTITY_OPTIONS.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={option.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-green-500">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {URGENCY_OPTIONS.map((urgency) => (
                          <SelectItem key={urgency.value} value={urgency.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={urgency.color} variant="secondary">
                                {urgency.value.toUpperCase()}
                              </Badge>
                              {urgency.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Provide any additional details that might be helpful
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide additional details about the waste..."
                        className="min-h-[100px] focus:ring-2 focus:ring-green-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label>Photos (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop photos here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo-upload")?.click()}
                  >
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Maximum 10MB per file. JPG, PNG, GIF supported.
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square rounded-lg bg-gray-100 p-2">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeFile(index)}
                        >
                          ×
                        </Button>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Your contact details for follow-up if needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="reporterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporter Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        {...field}
                        className="focus:ring-2 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Your phone number for follow-up"
                        {...field}
                        className="focus:ring-2 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        className="focus:ring-2 focus:ring-green-500"
                        readOnly={!!userProfile?.email}
                      />
                    </FormControl>
                    <FormDescription>
                      {userProfile?.email ? "Email from your profile" : "Required for updates on your report"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isLoading || isDraft}
                    className="flex items-center gap-2"
                  >
                    {isDraft ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Saved as Draft
                      </>
                    ) : (
                      "Save as Draft"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearForm}
                    disabled={isLoading}
                  >
                    Clear Form
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin border-2 border-gray-200 rounded-full border-t-gray-600" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>

              {!canSubmit && progress < 100 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">
                      Please complete all required fields to submit your report.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  );
}
