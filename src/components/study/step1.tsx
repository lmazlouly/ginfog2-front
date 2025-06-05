import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { FormType } from "./types";
import { Textarea } from "../ui/textarea";
import { InfoTooltip } from "../ui/info-tooltip";

const textAreaQuestions = [
  {
    id: "description",
    title: "Content Description",
    description: "What will you be teaching when you plan to use this strategy?",
    placeholder: "What will you be teaching when you plan to use this strategy?",
    tooltip: "Think about your learning objectives and get clear on what you are trying to achieve in this unit."
  },
  {
    id: "impact",
    title: "Reflection Prompt: How will this strategy change your classroom?",
    description: "Explain how your selected strategy supports student achievement of your learning objectives. Consider what will be different for you and your students as a result of using this strategy.",
    placeholder: "This strategy will help students practice their phonemic awareness of…",
  },
]

export const Step1 = ({ form } : { form: UseFormReturn<FormType> }) => {
  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to the Study Planner Wizard</h2>
        <p className="text-gray-600 mt-2">
          Let's Plan Your Study!
        </p>
        <p className="text-gray-600 text-sm">
        This tool helps you define what your chosen strategy looks like in practice, plan for implementation, and record key context details
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem className="col-span-2">
            <div className="flex items-center justify-between">
              <FormLabel>
                Study Title&nbsp;
                <span className="text-gray-500 text-sm">
                  (unit name + strategy)
                </span>
              </FormLabel>
              <InfoTooltip 
                message="Give this study a title that will make it easy for you to come back and find it later" 
                side="left"
              />
            </div>
            <FormControl>
              <Input placeholder="Consider using some combination of the unit or lesson you plan to teach and the name of the strategy" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {textAreaQuestions.map((question) => (
        <div key={"question_" + question.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
          {/* <h3 className="font-medium text-gray-800 mb-1" dangerouslySetInnerHTML={{ __html: question.title }} />
          <p className="text-sm text-gray-500 mb-3">{question.description}</p> */}
          <FormField control={form.control} name={question.id as keyof FormType} render={({ field }) => (
            <FormItem className="col-span-2">
              <div className="flex items-center justify-between">
                <FormLabel className="flex-grow">
                  {question.title}&nbsp;
                  <br />
                  <span className="text-gray-500 text-sm">
                    {question.description}
                  </span>
                </FormLabel>
                {question.tooltip && (
                  <InfoTooltip 
                    message={question.tooltip} 
                    side="left"
                  />
                )}
              </div>
              <FormControl>
                {/* <Input placeholder={question.placeholder} {...field} /> */}
                <Textarea
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                  placeholder={question.placeholder}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      ))}
    </>
  );
}