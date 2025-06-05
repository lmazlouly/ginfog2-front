"use client";
import { MinusIcon, PlusIcon, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormType } from "@/components/study/types";
import { Textarea } from "../ui/textarea";
import { InfoTooltip } from "../ui/info-tooltip";

export const Step2 = ({ form } : { form: UseFormReturn<FormType> }) => {
  if (form.getValues("executionSteps").length < 2) {
    form.setValue('executionSteps', ["", ""]);
  }

  // Add a step before the last step
  const addStep = async () => {
    const currentSteps = form.getValues("executionSteps");
    const newSteps = [
      ...currentSteps.slice(0, currentSteps.length - 1),
      "", // New step
      currentSteps[currentSteps.length - 1], // Keep the end step at the end
    ];

    form.setValue('executionSteps', newSteps);
    await form.trigger("executionSteps");
    form.clearErrors("executionSteps");
  };

  // Remove a step (but not the first or last)
  const removeStep = async (index: number) => {
    if (index === 0 || index === form.getValues("executionSteps").length - 1) {
      return; // Don't remove first or last step
    }

    const newSteps = form.getValues("executionSteps").filter((_, i) => i !== index);
    form.setValue('executionSteps', newSteps);
    await form.trigger("executionSteps");
    form.clearErrors("executionSteps");
  };

  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Strategy Execution Plan</h2>
        <p className="text-gray-600 mt-2">
        What are you doing? What are students doing? <br />
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center">
          <div className="flex px-2">
          <InfoTooltip 
            message="A minimum of 2 steps (Start and End) are required" 
            side="top"
          />
          </div>
 
          <h3 className="font-medium text-gray-800">
            Execution Steps
          </h3>
          <Button
            type="button"
            variant="default"
            onClick={addStep}
            className="ml-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>

        {form.getValues("executionSteps").map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name={`executionSteps.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold text-gray-700">
                      {index <= 0 && "The strategy will begin when"}
                      {index >= form.getValues("executionSteps").length - 1 && "The strategy will end when"}
                      {index !== 0 && index !== form.getValues("executionSteps").length - 1 && `Step ${index}`}
                    </FormLabel>
                    <div className="flex flex-row gap-2 w-full">
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Describe this step in your implementation plan..."
                          value={typeof field.value === "string" ? field.value : ""}
                          className="border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                        />
                      </FormControl>

                      {/* Remove button for all but the first step and last */}
                      {index !== 0 && index !== form.getValues("executionSteps").length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeStep(index)}
                        >
                          <MinusIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Add arrow between steps (except after the last step) */}
            {index < form.getValues("executionSteps").length - 1 && (
              <div className="flex justify-center my-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group hover:bg-gray-200 transition-colors">
                  <ArrowDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};