import { UseFormReturn } from "react-hook-form";
import { FormType } from "./types";
import { DatePicker } from "../ui/date-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { InfoTooltip } from "../ui/info-tooltip";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";

type QuestionType = {
  id: keyof FormType; // Ensure id is a valid key of FormType
  title: string;
  isMultiple: boolean;
  options: string[];
};

const questions: QuestionType[] = [
  {
    id: "strategyFrequency",
    title: "How often will you use the strategy?",
    isMultiple: false,
    options: [
      "Multiple times per day",
      "Once per day",
      "2-3 times per week",
      "Once per week",
      "Once per month"
    ]
  },
  {
    id: "strategyDuration",
    title: "How long will you use the strategy?",
    isMultiple: false,
    options: [
      "Less than 1 week",
      "1-2 weeks",
      "3-4 weeks",
      "1-2 months",
      "More than 2 months"
    ]
  },
  {
    id: "strategyUsage",
    title: "How will you use the strategy during instruction?",
    isMultiple: true,
    options: [
      "At the start of instruction",
      "At the end of instruction",
      "During small group instruction",
      "During individual instruction",
      "During group work time",
      "During whole group instruction",
      "During independent work time"
    ]
  }
];

const CheckBoxQuestion = ({ question, form }: { question: QuestionType; form: UseFormReturn<FormType> }) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-gray-800 mb-1">{question.title}</h3>
      <FormField
        control={form.control}
        name={question.id as keyof FormType}
        render={({ field }) => (
          <FormItem className="col-span-2">
            {question.options.map((option, optIndex) => (
              <div key={`checkboxOpt_${option}_${optIndex}`} className="flex items-center space-x-2">
                <FormControl>
                  <FormLabel htmlFor={`${option}_${optIndex}`} className="text-primary-700 font-medium cursor-pointer gap-2 flex items-center">
                    <Checkbox
                      id={`${option}_${optIndex}`}
                      {...field}
                      value={option}
                      // @ts-ignore
                      checked={Array.isArray(field.value) && field.value.includes(option)}
                      onCheckedChange={(checked) => {
                        // Cast to appropriate type for the form field
                        const fieldValue = field.value as string[] | undefined;
                        const currentValues = Array.isArray(fieldValue) ? fieldValue : [];

                        if (checked) {
                          // Add the option to the array if it's not already there
                          if (!currentValues.includes(option)) {
                            field.onChange([...currentValues, option]);
                          }
                        } else {
                          // Remove the option from the array
                          field.onChange(currentValues.filter(value => value !== option));
                        }
                      }}
                    />
                    {option}
                  </FormLabel>
                </FormControl>
              </div>
            ))}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

// Custom RadioQuestion component that supports an "Other" option with textarea
const RadioQuestion = ({ question, form }: { question: QuestionType; form: UseFormReturn<FormType> }) => {
  // State for the "Other" option
  const [otherValue, setOtherValue] = useState<string>("");

  return (
    <div className="mt-6">
      <h3 className="font-medium text-gray-800 mb-1">{question.title}</h3>
      <FormField
        control={form.control}
        name={question.id}
        render={({ field }) => {
          // Check if the current value is a custom "Other" value
          const currentValue = field.value as string | undefined;
          const isOtherOption = Boolean(currentValue) && !question.options.includes(currentValue || "");

          // Initialize other value if needed
          useEffect(() => {
            if (isOtherOption && currentValue) {
              setOtherValue(currentValue);
            }
          }, [currentValue, isOtherOption]);

          return (
            <FormItem className="col-span-2">
              <RadioGroup
                value={currentValue}
              // onValueChange={(value) => {
              //   // This is handled by the individual RadioGroupItem onClick handlers

              // }}
              >
                <div className="space-y-2">
                  {/* Standard options */}
                  {question.options.map((option, optIndex) => (
                    <div key={`radioOpt_${option}_${optIndex}`} className="flex items-center space-x-2">
                      <FormControl>
                        <FormLabel htmlFor={`${option}_${optIndex}`} className="text-primary-700 font-medium cursor-pointer gap-2 flex items-center">
                          <RadioGroupItem
                            id={`${option}_${optIndex}`}
                            value={option}
                            checked={field.value === option}
                            onClick={() => field.onChange(option)}
                          />
                          {option}
                        </FormLabel>
                      </FormControl>
                    </div>
                  ))}

                  {/* "Other" option */}
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <FormLabel htmlFor={`${question.id}_other`} className="text-primary-700 font-medium cursor-pointer gap-2 flex items-center">
                        <RadioGroupItem
                          id={`${question.id}_other`}
                          value="Other"
                          checked={isOtherOption}
                          onClick={() => {
                            // Just mark "Other" as selected but don't change the actual value yet
                            if (!isOtherOption) {
                              // Set a temporary value to indicate "Other" is selected
                              // We'll update this with the actual text input when they type
                              field.onChange("Other" as any);
                            }
                          }}
                        />
                        Other
                      </FormLabel>
                    </FormControl>
                  </div>

                  {/* Show input field when "Other" is selected */}
                  {isOtherOption && (
                    <div className="ml-7 mt-2">
                      <Input
                        placeholder="Please specify..."
                        value={otherValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setOtherValue(newValue);
                          // Update the form with the custom text
                          if (newValue.trim()) {
                            field.onChange(newValue);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

export function Step6({ form }: { form: UseFormReturn<FormType> }) {
  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Implementation Frequency & Duration</h2>
        {/* <p className="text-gray-600 mt-2">
          Tell us about the classes involved in your study
        </p> */}
      </div>

      <div className="space-y-6">
        {/* Start and End date */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-700">
              When will you conduct your study?
            </h3>
            <InfoTooltip message="Reminder that for most strategies, dosage matters. The more you use the strategy, the more likely you are to see a difference in your classroom. " side="left" />
          </div>
          <div className="flex flex-row justify-between">
            {/* Start Date */}
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Start Date
                      <br />
                      <span className="text-gray-500 text-sm">
                        When will you begin this unit?
                      </span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        defaultValue={field.value ? new Date(field.value) : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* End Date */}
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      End Date
                      <br />
                      <span className="text-gray-500 text-sm">
                        When do you expect to complete this unit?
                      </span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker {...field} defaultValue={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {/* Frequency and Duration */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {questions.map((question, i) => (
            question.isMultiple ?
              <CheckBoxQuestion key={`checkboxQuestion_${question.id}_${i}`} question={question} form={form} />
              :
              <RadioQuestion key={`radioQuestion_${question.id}_${i}`} question={question} form={form} />
          ))}
        </div>
      </div>
    </>
  );
}