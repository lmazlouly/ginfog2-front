"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal, BookOpenText, LayoutPanelTop, Calendar, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Headers = {
  title: string,
  accessorKey: string,
  render?: (value: unknown, row: unknown) => React.ReactNode
  isSortable?: boolean,
  width?: string
}

interface CardGridProps<TData> {
  columns: Headers[]
  data: TData[]
  cardsPerPage?: number
  cardsPerRow?: number
}

export function CardGrid<TData>({
  columns,
  data,
  cardsPerPage = 8,
  cardsPerRow = 4,
}: CardGridProps<TData>) {
  const [currentPage, setCurrentPage] = React.useState(0)
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null)

  // Calculate pagination
  const pageCount = Math.ceil(data.length / cardsPerPage)
  const paginatedData = React.useMemo(() => {
    const start = currentPage * cardsPerPage
    const end = start + cardsPerPage
    return data.slice(start, end)
  }, [data, currentPage, cardsPerPage])

  // Access keys for title and ID
  const titleKey = columns.find(col => col.accessorKey === "title")?.accessorKey || "title"
  const idKey = "id"

  // Function to get value from nested path
  const getNestedValue = (obj: any, path: string) => {
    const keys = path.split('.')
    return keys.reduce((o, key) => (o || {})[key], obj) || ""
  }

  // Get rendered value (using column's render function if available)
  const getRenderedValue = (column: Headers, row: TData) => {
    const value = getNestedValue(row, column.accessorKey)
    
    if (column.render) {
      return column.render(value, row)
    }
    
    return value
  }

  // Handle page changes
  const nextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  // Generate grid template based on cardsPerRow
  const gridTemplateColumns = `repeat(${cardsPerRow}, minmax(0, 1fr))`

  return (
    <div className="space-y-4">
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns }}
      >
        {paginatedData.map((row: any, i) => (
          <div
            key={`${row[idKey]}-${i}`}
            className="perspective-1000 relative h-96 cursor-pointer"
            onMouseEnter={() => setHoveredCard(row[idKey])}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => window.location.href = `/studies/${row[idKey]}/cycle`}
          >
            <div 
              className={cn(
                "absolute inset-0 w-full h-full rounded-lg border shadow-sm transition-all duration-500 transform-style-3d",
                hoveredCard === row[idKey] ? "rotate-y-180 border-blue-500 border-2" : "border-gray-200",
                "hover:border-blue-400 hover:border-opacity-50 hover:border-2"
              )}
            >
              {/* Front of card */}
              <div className="absolute inset-0 w-full h-full rounded-lg bg-white flex flex-col backface-hidden overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2" title={getNestedValue(row, titleKey).toString()}>
                    {getRenderedValue(columns.find(col => col.accessorKey === titleKey) || columns[0], row)}
                  </h3>
                </div>
                
                <div className="px-5 pb-4 flex-1 space-y-6">
                  {/* Strategy title if available */}
                  {columns.find(col => col.accessorKey === "strategy.title") && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpenText className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-600">Strategy</p>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 pl-6" title={getNestedValue(row, "strategy.title").toString()}>
                        {getNestedValue(row, "strategy.title")}
                      </p>
                    </div>
                  )}
                  
                  {/* Experiment Design */}
                  {columns.find(col => col.accessorKey === "isMultipleGroup") && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <LayoutPanelTop className="h-4 w-4 text-purple-600" />
                        <p className="text-sm font-medium text-gray-600">Design</p>
                      </div>
                      <p className="text-sm pl-6">
                        {getNestedValue(row, "isMultipleGroup") ? "Multiple Group Design" : "Single Group Design"}
                      </p>
                    </div>
                  )}
                  
                  {/* Dates */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <p className="text-sm font-medium text-gray-600">Timeline</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      {columns.find(col => col.accessorKey === "startDate") && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Start</p>
                          <p className="text-sm font-medium">
                            {getNestedValue(row, "startDate") ? new Date(getNestedValue(row, "startDate")).toLocaleDateString() : "TBD"}
                          </p>
                        </div>
                      )}
                      
                      {columns.find(col => col.accessorKey === "endDate") && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">End</p>
                          <p className="text-sm font-medium">
                            {getNestedValue(row, "endDate") ? new Date(getNestedValue(row, "endDate")).toLocaleDateString() : "TBD"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status indicator at bottom */}
                <div className="mt-auto">
                  {getNestedValue(row, "status") && (
                    <div className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 text-sm font-medium",
                      getNestedValue(row, "status") === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
                    )}>
                      {getNestedValue(row, "status") === "DRAFT" ? (
                        <>
                          <AlertTriangle className="h-4 w-4" />
                          Draft
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Published
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Back of card */}
              <div className="absolute inset-0 w-full h-full rounded-lg bg-gray-50 flex flex-col backface-hidden rotate-y-180 overflow-hidden">
                {/* Card header - Strategy Title */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
                  <h3 className="text-base font-semibold text-gray-700">
                    Study Details
                  </h3>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-4 text-sm">
                  {/* Execution Steps - First and Last */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Execution Plan</h4>
                    <div className="space-y-2">
                      {getNestedValue(row, "executionSteps") && Array.isArray(getNestedValue(row, "executionSteps")) ? (
                        <>
                          <div className="border-b border-gray-100 pb-2">
                            <span className="text-xs text-gray-500 block">Starts with:</span>
                            <span className="text-gray-800 line-clamp-2">
                              {getNestedValue(row, "executionSteps")[0] || "Not specified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Ends with:</span>
                            <span className="text-gray-800 line-clamp-2">
                              {getNestedValue(row, "executionSteps")[getNestedValue(row, "executionSteps").length - 1] || "Not specified"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-amber-600">Execution steps not defined</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Implementation Details - Frequency, Duration, Usage */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Implementation Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500 block">Frequency:</span>
                        <span className="text-gray-800">
                          {getNestedValue(row, "strategyFrequency") || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">Duration:</span>
                        <span className="text-gray-800">
                          {getNestedValue(row, "strategyDuration") || "Not specified"}
                        </span>
                      </div>
                    </div>
                    {/* Usage (Strategy Usage) */}
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 block">Usage:</span>
                      {getNestedValue(row, "strategyUsage") && Array.isArray(getNestedValue(row, "strategyUsage")) ? (
                        <ul className="list-disc list-inside text-xs text-gray-700 pl-1">
                          {getNestedValue(row, "strategyUsage").slice(0, 2).map((usage: string, i: number) => (
                            <li key={`usage-${i}`} className="line-clamp-1">{usage}</li>
                          ))}
                          {getNestedValue(row, "strategyUsage").length > 2 && (
                            <li className="text-gray-500">+{getNestedValue(row, "strategyUsage").length - 2} more</li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-gray-500 text-xs">No usage details</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Assessment Information */}
                  <div className="border-t border-gray-100 pt-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                      {getNestedValue(row, "assessmentName") ? getNestedValue(row, "assessmentName") : "Assessment"}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500 block">Pre-Assessment:</span>
                        <span className="text-gray-800">
                          {getNestedValue(row, "preAssessmentDate") ? 
                            new Date(getNestedValue(row, "preAssessmentDate")).toLocaleDateString() : "Not scheduled"}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 block">Post-Assessment:</span>
                        <span className="text-gray-800">
                          {getNestedValue(row, "postAssessmentDate") ?
                            new Date(getNestedValue(row, "postAssessmentDate")).toLocaleDateString() : "Not scheduled"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Mid Assessment (only for multiple group design) */}
                    {getNestedValue(row, "isMultipleGroup") && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 block">Mid-Assessment:</span>
                        <span className="text-gray-800">
                          {getNestedValue(row, "midAssessmentDate") ?
                            new Date(getNestedValue(row, "midAssessmentDate")).toLocaleDateString() : "Not scheduled"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty state if no studies */}
        {data.length === 0 && (
          <div className="col-span-full h-60 flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center space-y-2 p-6">
              <p className="text-muted-foreground">No studies found</p>
              <Link 
                href="/strategies"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Your First Study
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
