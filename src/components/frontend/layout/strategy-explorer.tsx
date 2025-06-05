"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { toast } from "@/hooks/use-toast";

// API calls for strategies and filter options
import { getBookmarkedStrategies, getStrategies } from "@/lib/api/generated/strategies/strategies";
import {
  GetStrategies200Item as StrategyModel,
  GetContentAreas200Item as ContentAreaModel,
  GetLevelsOfEvidence200Item as LevelOfEvidenceModel,
  GetGrades200Item as GradeModel,
  GetStrategies200ItemGradesItem as GradeRelationModel,
  GetStrategies200ItemLearningStandardsItem as LearningStandardRelationModel,
  GetStrategies200ItemTeachingStandardsItem as TeachingStandardRelationModel,
  GetLearningStandardById200 as LearningStandardModel,
  GetTeachingStandardById200 as TeachingStandardModel,
} from "@/lib/api/models";

import { MultiSelect } from "@/components/ui/multi-select";
import { getLearningStandards } from "@/lib/api/generated/learning-standard/learning-standard";
import { getTeachingStandards } from "@/lib/api/generated/teaching-standards/teaching-standards";
// import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getContentAreas } from "@/lib/api/generated/content-areas/content-areas";
import { getGrades } from "@/lib/api/generated/grades/grades";

const columns = [
  // {
  //   accessorKey: "code",
  //   title: "Code",
  // },
  {
    accessorKey: "title",
    title: "Strategy",
    width: "25%",
    render: (value: string, row: StrategyModel) => (
      <Link href={`/strategies/${row.id}`} className="text-base font-medium whitespace-normal break-words hover:text-orange">{value}</Link>
    ),
  },
  {
    accessorKey: "contentArea",
    title: "Content Area",
    width: "15%",
    render: (contentArea: ContentAreaModel) => contentArea?.name || "",
  },
  {
    accessorKey: "levelOfEvidence",
    title: "Evidence",
    width: "10%",
    render: (levelOfEvidence: LevelOfEvidenceModel) => levelOfEvidence?.name || "",
  },
  {
    accessorKey: "grades",
    title: "Grades",
    width: "15%",
    render: (gradesRelation: GradeRelationModel[]) => {
      if (!Array.isArray(gradesRelation) || gradesRelation.length === 0) {
        return "";
      }

      // Sort the grades by their rank
      const sortedGrades = [...gradesRelation].sort(
        (a, b) => (a.grade?.rank || 0) - (b.grade?.rank || 0)
      );

      // Get the first (lowest rank) and last (highest rank) grades
      const firstGrade = sortedGrades[0].grade?.name;
      const lastGrade = sortedGrades[sortedGrades.length - 1].grade?.name;

      return `${firstGrade} - ${lastGrade}`;
    }
  },
  // {
  //   accessorKey: "details",
  //   title: "Details",
  //   render: (value: string) =>
  //     value && value.length > 100 ? value.substring(0, 100) + "..." : value,
  // },
  {
    accessorKey: "learningStandards",
    title: "Learning Standard",
    width: "17.5%",
    render: (learningStandardRelations: LearningStandardRelationModel[]) =>
      Array.isArray(learningStandardRelations) ? (
        <div className="flex flex-wrap gap-1">
          {learningStandardRelations.map((relation: LearningStandardRelationModel, index: number) => {
            return relation.learningStandard?.description ? (
              <TooltipProvider key={index + '_SC_Learning_Standard'} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="text-xs m-[.5px] text-raspberry">{relation.learningStandard?.name}</div>
                  </TooltipTrigger>
                  <TooltipContent className="w-64">
                    <p>{relation.learningStandard?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div key={index + '_SC_Learning_Standard'} className="text-xs m-[.5px] text-raspberry">{relation.learningStandard?.name}</div>
            );
          })}
        </div>
      ) : "",
  },
  {
    accessorKey: "teachingStandards",
    title: "Teaching Standard",
    width: "17.5%",
    render: (teachingStandardRelations: TeachingStandardRelationModel[]) =>
      Array.isArray(teachingStandardRelations) ? (
        <div className="flex flex-wrap gap-1">
          {teachingStandardRelations.map((relation: TeachingStandardRelationModel, index: number) => {
            return relation.teachingStandard?.description ? (
              <TooltipProvider key={index + '_SC_Teaching_Standard'} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="text-xs m-[.5px] text-teal">{relation.teachingStandard?.name}</div>
                  </TooltipTrigger>
                  <TooltipContent className="w-64">
                    <p>{relation.teachingStandard?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div key={index + '_SC_Teaching_Standard'} className="text-xs m-[.5px] text-teal">{relation.teachingStandard?.name}</div>
            );
          })}
        </div>
      ) : "",
  },
  // {
  //   accessorKey: "id",
  //   title: "Actions",
  //   render: (id: string) => (
  //     <div className="flex items-center justify-start gap-2">
  //       <Link href={`/strategies/${id}`}>
  //         <Button variant="outline" size="sm">
  //           Learn More
  //         </Button>
  //       </Link>
  //     </div>
  //   ),
  // },
];

export default function StrategyExplorer({ onlyBookmarks }: { onlyBookmarks?: boolean }) {
  // const searchParams = useSearchParams();
  // Read the "tab" query parameter (defaults to "all" if not provided)
  // const defaultTab = searchParams.get("tab") || "all";
  const [strategies, setStrategies] = useState<StrategyModel[]>([]);
  const [loading, setLoading] = useState(true);

  // States for filter panel
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // MultiSelect states (store arrays of lowercase values)
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedLearning, setSelectedLearning] = useState<string[]>([]);
  const [selectedTeaching, setSelectedTeaching] = useState<string[]>([]);

  // Options from API
  const [contentAreasList, setContentAreasList] = useState<ContentAreaModel[]>(
    []
  );
  const [gradesList, setGradesList] = useState<GradeModel[]>([]);
  const [learningStandardsList, setLearningStandardsList] = useState<
    LearningStandardModel[]
  >([]);
  const [teachingStandardsList, setTeachingStandardsList] = useState<
    TeachingStandardModel[]
  >([]);

  // Track if any filters are active
  const hasFilterChanges =
    searchQuery.length > 0 ||
    selectedContents.length > 0 ||
    selectedGrades.length > 0 ||
    selectedLearning.length > 0 ||
    selectedTeaching.length > 0;

  // Fetch strategies
  useEffect(() => {
    (onlyBookmarks ? getBookmarkedStrategies({
      "relations[]": [
        "contentArea",
        "levelOfEvidence",
        "grades.grade",
        "teachingStandards.teachingStandard",
        "learningStandards.learningStandard",
      ],
    }) : getStrategies({
      "relations[]": [
        "contentArea",
        "levelOfEvidence",
        "grades.grade",
        "teachingStandards.teachingStandard",
        "learningStandards.learningStandard",
      ],
    }))
      .then((data) => {
        setStrategies(data);
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Failed to fetch strategies",
          description: "Something went wrong while fetching strategies.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch content areas
  useEffect(() => {
    getContentAreas()
      .then((res: ContentAreaModel[]) => {
        setContentAreasList(res);
      })
      .catch((err: unknown) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Failed to fetch content areas",
          description: "Something went wrong while fetching content areas.",
        });
      });
  }, []);

  // Fetch grades
  useEffect(() => {
    getGrades()
      .then((res: GradeModel[]) => {
        setGradesList(res);
      })
      .catch((err: unknown) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Failed to fetch grades",
          description: "Something went wrong while fetching grades.",
        });
      });
  }, []);

  // Fetch learning standards
  useEffect(() => {
    getLearningStandards()
      .then((res: LearningStandardModel[]) => {
        setLearningStandardsList(res);
      })
      .catch((err: unknown) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Failed to fetch learning standards",
          description:
            "Something went wrong while fetching learning standards.",
        });
      });
  }, []);

  // Fetch teaching standards
  useEffect(() => {
    getTeachingStandards()
      .then((res: TeachingStandardModel[]) => {
        setTeachingStandardsList(res);
      })
      .catch((err: unknown) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Failed to fetch teaching standards",
          description:
            "Something went wrong while fetching teaching standards.",
        });
      });
  }, []);

  // Create options for MultiSelect
  const contentOptions = contentAreasList.map((ca) => ({
    label: ca.name,
    value: ca.name.toLowerCase(),
  }));

  const gradeOptions = gradesList.map((grade) => ({
    label: grade.name,
    value: grade.name.toLowerCase(),
  }));

  const learningOptions = learningStandardsList.map((ls) => ({
    label: ls.name,
    value: ls.name.toLowerCase(),
  }));

  const teachingOptions = teachingStandardsList.map((ts) => ({
    label: ts.name,
    value: ts.name.toLowerCase(),
  }));

  // Filter logic
  const filteredData = strategies.filter((strategy) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.contentArea?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // MultiSelect - Content
    const contentName = strategy.contentArea?.name?.toLowerCase() || "";
    const matchesContent =
      selectedContents.length === 0 || selectedContents.includes(contentName);

    // MultiSelect - Grades
    const gradeNames = Array.isArray(strategy.grades)
      ? strategy.grades.map((relation) => relation.grade.name?.toLowerCase())
      : [];
    const matchesGrade =
      selectedGrades.length === 0 ||
      gradeNames.some((gn) => selectedGrades.includes(gn));

    // MultiSelect - Learning Standards
    const learningNames = Array.isArray(strategy.learningStandards)
      ? strategy.learningStandards.map((ls) =>
        ls.learningStandard?.name?.toLowerCase()
      )
      : [];
    const matchesLearning =
      selectedLearning.length === 0 ||
      learningNames.some((ln) => selectedLearning.includes(ln));

    // MultiSelect - Teaching Standards
    const teachingNames = Array.isArray(strategy.teachingStandards)
      ? strategy.teachingStandards.map((ts) =>
        ts.teachingStandard?.name?.toLowerCase()
      )
      : [];
    const matchesTeaching =
      selectedTeaching.length === 0 ||
      teachingNames.some((tn) => selectedTeaching.includes(tn));

    return (
      matchesSearch &&
      matchesContent &&
      matchesGrade &&
      matchesLearning &&
      matchesTeaching
    );
  });

  // Clear all filters
  function clearFilters() {
    setSearchQuery("");
    setSelectedContents([]);
    setSelectedGrades([]);
    setSelectedLearning([]);
    setSelectedTeaching([]);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Intro */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Strategies
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore evidence-based teaching strategies for your classroom
          </p>
        </div>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="w-fit gap-1">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">
                  What is an intervention strategy?
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p>
                Intervention strategies are evidence-based approaches designed
                to help students overcome specific learning challenges and
                improve academic outcomes.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>

      {/* Tabs */}
      {/* <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="all">All Strategies</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-4">
          
        </TabsContent>

        <TabsContent value="recommended" className="pt-4">
          <Card>
            <CardContent className="flex h-40 items-center justify-center p-6">
              <p className="text-muted-foreground">
                Sign in to view personalized strategy recommendations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="pt-4">
          <Card>
            <CardContent className="flex h-40 items-center justify-center p-6">
              <p className="text-muted-foreground">
                Sign in to view your favorite strategies.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}

      <Card>
        <CardContent className="p-6">
          {/* Filters Row */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


            {/* Left side: Filter Toggle & Clear */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="gap-1"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>

              {hasFilterChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Right side: Label & Search */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h3 className="text-sm font-medium">
                Refine your list of strategies
              </h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by keyword"
                  className="w-full pl-9 md:w-[260px] bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Collapsible Filters */}
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <CollapsibleContent className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Content Areas Filter */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Content Areas
                  </label>
                  <MultiSelect
                    placeholder="Select content areas"
                    options={contentOptions}
                    onValueChange={(vals) =>
                      setSelectedContents(vals.map((v) => v.toLowerCase()))
                    }
                    defaultValue={selectedContents}
                  />
                </div>

                {/* Grade Levels Filter */}
                <div className="space-y-2">
                  <label htmlFor="grade" className="text-sm font-medium">
                    Grade Levels
                  </label>
                  <MultiSelect
                    placeholder="Select grade levels"
                    options={gradeOptions}
                    onValueChange={(vals) =>
                      setSelectedGrades(vals.map((v) => v.toLowerCase()))
                    }
                    defaultValue={selectedGrades}
                  />
                </div>

                {/* Learning Standards Filter */}
                <div className="space-y-2">
                  <label htmlFor="learning" className="text-sm font-medium">
                    Learning Standards
                  </label>
                  <MultiSelect
                    placeholder="Select learning standards"
                    options={learningOptions}
                    onValueChange={(vals) =>
                      setSelectedLearning(vals.map((v) => v.toLowerCase()))
                    }
                    defaultValue={selectedLearning}
                  />
                </div>

                {/* Teaching Standards Filter */}
                <div className="space-y-2">
                  <label htmlFor="teaching" className="text-sm font-medium">
                    Teaching Standards
                  </label>
                  <MultiSelect
                    placeholder="Select teaching standards"
                    options={teachingOptions}
                    onValueChange={(vals) =>
                      setSelectedTeaching(vals.map((v) => v.toLowerCase()))
                    }
                    defaultValue={selectedTeaching}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* DataTable / Skeleton */}
          <div className="rounded-md border">
            {loading ? (
              <DataTableSkeleton
                columns={columns as unknown[] as never[]}
              />
            ) : filteredData.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No strategies found with the selected filters.
              </div>
            ) : (
              // Add extra container to adjust spacing for pagination
              <div className="mt-4 px-2 pb-4">
                <DataTable
                  data={filteredData}
                  columns={columns as unknown[] as never[]}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
