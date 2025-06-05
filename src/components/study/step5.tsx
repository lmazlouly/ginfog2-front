import { UseFormReturn } from "react-hook-form";
import { FormType } from "./types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
// import { useGetGrades } from "@/lib/api/generated/grades/grades";
import { GetGrades200Item as GradeModel} from "@/lib/api/models";
import { Slider } from "../ui/slider";
import { useEffect } from "react";
import { InfoTooltip } from "../ui/info-tooltip";

enum GroupType {
  EXPERIMENTAL = "EXPERIMENTAL",
  COMPARISON = "COMPARISON"
}

const ClassGroupForm = ({ form, type, grades }: { form: UseFormReturn<FormType>, type: GroupType, grades: GradeModel[] }) => {

  useEffect(() => {
    const groupInformation = form.getValues(`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}`);
    // Initialize any undefined values
    if (groupInformation.similarity === undefined) {
      form.setValue(`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.similarity`, 3);
    }

    form.setValue(`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.type`, type.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
      {/* Class Title */}
      <FormField
        control={form.control}
        name={`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.title`}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <div className="flex items-center justify-between">
              <FormLabel>Class Title</FormLabel>
              <InfoTooltip 
                message={type === GroupType.COMPARISON 
                  ? "This is the class receiving 'teaching as normal' (no strategy)." 
                  : "This is the class receiving the strategy you chose."} 
                side="left" 
              />
            </div>
            <FormControl>
              <Input placeholder="E.g. Period 3" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* numberOfStudents */}
      <FormField
        control={form.control}
        name={`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.numberOfStudents`}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Number of Students</FormLabel>
            <FormControl>
              <Input type="number" placeholder="E.g. 25" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Course Name or Subject */}
      <FormField
        control={form.control}
        name={`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.courseName`}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Course Name or Subject</FormLabel>
            <FormControl>
              <Input placeholder="E.g. Algebra 1" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Grades */}
      <FormField
        control={form.control}
        name={`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.grades`}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Grades</FormLabel>
            <FormControl>
              <MultiSelect
                {...field}
                options={grades.map((grade) => ({
                  label: grade.name,
                  value: grade.id,
                }))}
                onValueChange={(value) => {
                  console.log(value);
                  field.onChange(value);
                }}
                defaultValue={field.value || []}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Other Information */}
      <FormField
        control={form.control}
        name={`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.otherInformation`}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Other Information</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="E.g. This class is a mix of students with different learning needs."
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* if second groupe or class add confidence slider */}
      {type === GroupType.COMPARISON && (
        <FormField
          control={form.control}
          name={`groupInformation.${type === GroupType.COMPARISON ? 1 : 0}.similarity`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                How confident are you that your comparison group is similar in demographics to your study group?
                <br />
                {field.value}/5
              </FormLabel>
              <FormControl>
                <Slider
                  onValueChange={(value: number[]) => { field.onChange(value[0]) }}
                  defaultValue={[field.value ?? 3]}
                  min={0}
                  max={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}

export function Step5({ form, grades }: { form: UseFormReturn<FormType>, grades: GradeModel[] }) {
  // const grades = useGetGrades();
  // if (grades.isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="text-center py-4 px-8 bg-background-foreground">
        <h2 className="text-2xl font-bold text-gray-800">Class Details</h2>
        <p className="text-gray-600 mt-2">
          Tell us about the classes involved in your study
        </p>
      </div>

      <div className={form.getValues("isMultipleGroup") ? "grid grid-cols-2 gap-2" : ""}>
        <ClassGroupForm form={form} grades={grades} type={GroupType.EXPERIMENTAL} />
        {form.getValues("isMultipleGroup") && <ClassGroupForm form={form} type={GroupType.COMPARISON} grades={grades} />}
      </div>
    </>
  );
}