import { UseFormReturn } from "react-hook-form";
import { FormType } from "./types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

export function Step4({ form }: { form: UseFormReturn<FormType> }) {
  const textAreaQuestions = [
    {
      id: "step4_1",
      title: "When you are NOT using the strategy (before you implement the strategy), what will your instruction look like?",
      description: "Describe how you will compare the results of your study.",
      placeholder: "e.g., When I am not using the strategy, I will...",
      condition: {
        column: "isMultipleGroup",
        value: false,
      }
    },
    {
      id: "step4_1",
      title: "When you are NOT using the strategy (in the classroom you are not using the strategy), what will your instruction look like?",
      description: "Describe how you will compare the results of your study.",
      placeholder: "e.g., When I am not using the strategy, I will...",
      condition: {
        column: "isMultipleGroup",
        value: true,
      }
    },
  ];
  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Strategy Comparison Conditions</h2>
        {/* <p className="text-gray-600 mt-2">
          Which design will you use to test your teaching strategy?
        </p> */}
      </div>

      {textAreaQuestions.map((question) => (
        question.condition && question.condition.value === form.getValues(question.condition.column as keyof FormType) &&
        <div key={"question_" + question.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
          <FormField control={form.control} name="comparisonMethod" render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {question.title}&nbsp;
                <br />
                <span className="text-gray-500 text-sm">
                  {question.description}
                </span>
              </FormLabel>
              <FormControl>
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