import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormType } from "./types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/date-picker";

export const Step7 = ({ form }: { form: UseFormReturn<FormType> }) => {
  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Assessment Planning</h2>
        <p className="text-gray-600 mt-2">
          Tell us how you will measure how your strategy impacts your students.
        </p>
      </div>
      <div className="space-y-6">

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <FormField control={form.control} name="assessmentName" render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                Assessment Title
              </FormLabel>
              <FormControl>
                <Input placeholder="Provide a clear descriptive name for the assessment" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <FormField control={form.control} name="assessmentDescription" render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                Assessment Description
                <br />
                <span className="text-gray-500 text-sm">
                  Briefly describe the assessment you are using.
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Is the assessment: off the shelf, teacher-created, behavioral, essay, multiple choice etc."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className={`grid grid-cols-${!form.getValues("isMultipleGroup") ? "3" : "2"} gap-4`}>
            <FormField
              control={form.control}
              name="preAssessmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>
                    Pre-Assessment Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      defaultValue={field.value ? new Date(field.value) : undefined}
                      minDate={form.getValues("startDate") ? new Date(form.getValues("startDate")) : undefined}
                      maxDate={form.getValues("endDate") ? new Date(form.getValues("endDate")) : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.getValues("isMultipleGroup") && (
              <FormField
                control={form.control}
                name="midAssessmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>
                      Mid-Assessment Date
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        defaultValue={field.value ? new Date(field.value) : undefined}
                        minDate={form.getValues("startDate") ? new Date(form.getValues("startDate")) : undefined}
                        maxDate={form.getValues("endDate") ? new Date(form.getValues("endDate")) : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />)}

            <FormField
              control={form.control}
              name="postAssessmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>
                    Post-Assessment Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      defaultValue={field.value ? new Date(field.value) : undefined}
                      minDate={form.getValues("startDate") ? new Date(form.getValues("startDate")) : undefined}
                      maxDate={form.getValues("endDate") ? new Date(form.getValues("endDate")) : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        </div>
      </div>

    </>
  );
}