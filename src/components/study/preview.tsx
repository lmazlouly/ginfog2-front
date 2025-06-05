// import { Printer, Download, Share2 } from 'lucide-react';

import { UseFormReturn } from "react-hook-form";
import { FormType, schema } from "./types";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dot, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { GetStrategyById200 as StrategyModel } from "@/lib/api/models";

const EnhancedSummaryVisual = ({ form, strategy }: { form: UseFormReturn<FormType>, strategy?: StrategyModel }) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const sampleData = form.getValues();

  useEffect(() => {
    const result = schema.safeParse(form.getValues());
    if (!result.success) {
      result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      setErrorMessages(result.error.errors.map(err => err.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date: number | Date | undefined | string) => {
    return moment(date).format("MMMM Do, YYYY");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Content area */}
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Study Implementation Plan Preview</h1>
            {/* <p className="text-gray-500 mt-1">
              {sampleData.title}
            </p> */}
          </div>

          {/* Strategy Header Box/Warnings or Success */}
          {errorMessages.length > 0 && !form.formState.disabled &&
            <Alert className="mb-4" variant="warning">
              <TriangleAlert size={35} />
              <AlertTitle className="text-center">
                Please complete all required fields and correct any errors to finalize your study implementation
              </AlertTitle>
              <AlertDescription>
                <ul>
                  {errorMessages.map((message, index) => <li className="text-lg" key={index}>
                    <Dot className="inline-block mr-1" size={35} />  {message}
                  </li>)}
                </ul>
                {/* You can add components and dependencies to your app using the cli. */}
              </AlertDescription>
            </Alert>
          }

          {/* Main Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Title row */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 text-center font-bold text-lg">
              {sampleData.title}
            </div>

            {/* Strategy and dates row */}
            <div className="grid grid-cols-2 bg-gray-50">
              <div className="p-4 border-r border-b border-gray-200">
                <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Strategy</div>
                <div className="text-gray-800 font-medium">{strategy?.title}</div>
              </div>
              <div className="p-4 border-b border-gray-200">
                {(sampleData.startDate && sampleData.endDate) ?
                  (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Dates</div>
                      <div className="text-gray-800 font-medium">
                        <b>{formatDate(sampleData.startDate)}</b>
                        &nbsp;to&nbsp;
                        <b>{formatDate(sampleData.endDate)}</b>
                      </div>
                    </>
                  ) : (
                    <div className="text-yellow-500 font-medium p-[inherit]">
                      PLEASE SPECIFY START AND END DATE
                    </div>
                  )
                }
              </div>
            </div>

            {/* Strategy begins and design type rows */}
            <div className="grid grid-cols-2">
              <div className="p-4 border-r border-b border-gray-200">
                {(sampleData.executionSteps && sampleData.executionSteps[0]) ? (
                  <>
                    <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">The strategy begins when</div>
                    <div className="text-gray-800">{sampleData.executionSteps[0]}</div>
                  </>
                ) : (
                  <div className="uppercase text-yellow-500 font-medium p-[inherit] px-0 text-center">
                    Please fill in when the strategy begins
                  </div>
                )}
              </div>
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Research Design</div>
                <div className="text-gray-800 font-medium">
                  {sampleData.isMultipleGroup ? 'Multiple Group Design' : 'Single Group Design'}
                </div>
              </div>
            </div>

            {/* Strategy ends row */}
            <div className="grid grid-cols-2">
              <div className="p-4 border-r border-b border-gray-200">
                {(sampleData.executionSteps && sampleData.executionSteps[sampleData.executionSteps.length - 1]) ? (
                  <>
                    <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">The strategy ends when</div>
                    <div className="text-gray-800">{sampleData.executionSteps[sampleData.executionSteps.length - 1]}</div>
                  </>
                ) : (
                  <div className="uppercase text-yellow-500 font-medium p-[inherit] px-0 text-center">
                    Please fill in when the strategy ends
                  </div>
                )}
              </div>
              <div className="p-4 border-b border-gray-200">
                {sampleData.impact ? (
                  <>
                    <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Expected Impact</div>
                    <div className="text-gray-800">{sampleData.impact}</div>
                  </>
                ) : (
                  <div className="uppercase text-yellow-500 font-medium p-[inherit] px-0 text-center">
                    Please fill in expected impact
                  </div>
                )}
              </div>
            </div>

            {/* Classes using strategy row */}
            <div className={cn(
              "grid bg-gray-50",
              sampleData.isMultipleGroup ? "grid-cols-2" : "grid-cols-1 text-center"
            )}>
              <div className="p-4 border-r border-b border-gray-200">
                <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">
                  {sampleData.isMultipleGroup ? 'Experimental' : null} Group
                </div>
                {(sampleData.groupInformation && sampleData.groupInformation[0]?.courseName) ? (
                  <div className="text-gray-800">{sampleData.groupInformation[0]?.courseName}</div>
                ) : (
                  <div className="text-yellow-500 uppercase">
                    Course name is missing
                  </div>
                )}
              </div>
              {sampleData.isMultipleGroup &&
                <div className="p-4 border-b border-gray-200">
                  <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Control Group</div>
                  <div className="text-gray-800">{sampleData.groupInformation && sampleData.groupInformation[1]?.courseName}</div>
                </div>
              }
            </div>

            {/* Implementation section header */}
            <div className="p-3 bg-gray-700 text-white font-medium tracking-wide">
              IMPLEMENTATION DETAILS
            </div>

            {/* Implementation details */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  {(sampleData.strategyFrequency?.length > 0) ? (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Frequency</div>
                      <div className="text-gray-800">{sampleData.strategyFrequency}</div>
                    </>
                  ) : (
                    <div className="uppercase text-yellow-500 text-sm p-[inherit] px-0 text-center">
                      Please select an option for <b>When will you conduct your study?</b> before continuing.
                    </div>
                  )}
                </div>
                <div>
                  {(sampleData.strategyDuration?.length > 0) ? (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Duration</div>
                      <div className="text-gray-800">{sampleData.strategyDuration}</div>
                    </>
                  ) : (
                    <div className="uppercase text-yellow-500 text-sm p-[inherit] px-0 text-center">
                      Please select an option for <b>When do you expect to complete this unit?</b> before continuing.
                    </div>
                  )}
                </div>
                <div>
                  {(sampleData.strategyUsage?.length > 0) ? (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Usage</div>
                      <div className={sampleData.strategyUsage ? 'text-gray-800' : 'text-yellow-500 uppercase'}>
                        <ul>
                          {sampleData.strategyUsage.map(usage => (<li key={usage + Math.random()}>{usage}</li>))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="uppercase text-yellow-500 text-sm p-[inherit] px-0 text-center">
                      You must select at least one option for <b>How will you use the strategy during instruction?</b> before continuing.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assessment section header */}
            <div className="p-3 bg-gray-700 text-white font-medium tracking-wide">
              {sampleData.assessmentName ? sampleData.assessmentName : 'Assessment Details (Please specify a title)'}
            </div>

            {/* Assessment details */}
            <div className="p-4">
              <div className="mb-4">
                <div className="font-medium text-gray-800 mb-1">{sampleData.assessmentName}</div>
                <div className="text-gray-600">{sampleData.assessmentDescription}</div>
              </div>

              <div className={cn("grid gap-6 mt-4", !sampleData.isMultipleGroup ? "grid-cols-3" : "grid-cols-2")}>
                <div className="bg-blue-50 p-3 rounded border border-primary-100">
                  {sampleData.preAssessmentDate ? (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Pre-Assessment</div>
                      <div className="text-gray-800 font-medium">{formatDate(sampleData.preAssessmentDate)}</div>
                    </>
                  ) : (
                    <div className="uppercase text-yellow-500 text-sm p-[inherit] px-0 text-center">
                      Please select a date for <b>Pre-Assessment</b> before continuing.
                    </div>
                  )}
                </div>
                {!sampleData.isMultipleGroup && (<div className="bg-amber-50 p-3 rounded border border-amber-100">{
                  sampleData.midAssessmentDate ? (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Mid-Assessment</div>
                      <div className="text-gray-800 font-medium">{formatDate(sampleData.midAssessmentDate)}</div>
                    </>
                  ) : (
                    <div className="uppercase text-yellow-500 text-sm p-[inherit] px-0 text-center">
                      Please select a date for <b>Mid-Assessment</b> before continuing.
                    </div>
                  )
                }</div>)
                }
                <div className="bg-green-50 p-3 rounded border border-green-100">
                  {sampleData.postAssessmentDate ? (
                    <>
                      <div className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-1">Post-Assessment</div>
                      <div className="text-gray-800 font-medium">{formatDate(sampleData.postAssessmentDate)}</div>
                    </>
                  ) : (
                    <div className="uppercase text-yellow-500 text-sm p-[inherit] px-0 text-center">
                      Please select a date for <b>Post-Assessment</b> before continuing.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500">
              Created on <b>{formatDate(strategy?.createdAt)}</b> • Last update made <b>{formatDate(strategy?.updatedAt)}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSummaryVisual;