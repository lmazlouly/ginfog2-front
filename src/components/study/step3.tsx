import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { FormType } from "./types";

export const Step3 = ({ form }: { form: UseFormReturn<FormType> }) => {
  const questions = [
    {
      id: 1,
      title: "Single Group Design",
      description: "I will be implementing my strategy with just one classroom or group of students.",
      value: false
    },
    {
      id: 2,
      title: "Multiple Group Design",
      description: "I will be implementing my strategy with one classroom and comparing the results to another classroom.",
      value: true
    },
  ]

  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Experiment Design</h2>
        <p className="text-gray-600 mt-2">
          Which design will you use to test your teaching strategy?
        </p>
      </div>

      <FormField
        control={form.control}
        name="isMultipleGroup"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10"
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value.toString()}
                disabled={form.formState.disabled}
              >
                {questions.map((question) => (
                  <div key={"experiment_" + question.id}>
                    <Label htmlFor={question.id.toString()} className="text-primary-700 font-medium cursor-pointer">
                      <Card
                        className={cn(
                          "hover:shadow-md transition-shadow cursor-pointer",
                          "bg-white rounded-xl shadow-sm p-6 h-64 border-2 border-primary-100",
                          "flex flex-col justify-between justify-center text-center",
                          field.value === question.value ? "border-primary" : ""
                        )}
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-3">{question.title}</h2>
                          <p className="text-gray-600">
                            {question.description}
                          </p>
                        </div>
                        <div className="flex items-center mt-4 hidden">
                          <RadioGroupItem
                            value={question.value.toString()}
                            id={question.id.toString()}
                            className="w-6 h-6 rounded-full border-2 border-primary-100 mr-3 flex-shrink-0"
                          />
                          <Label htmlFor={question.id.toString()} className="text-primary-700 font-medium cursor-pointer">
                            Select this option
                          </Label>
                        </div>
                      </Card>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}