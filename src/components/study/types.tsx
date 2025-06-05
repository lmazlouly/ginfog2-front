import * as z from "zod";

const groupInformationSchema = z.object({
  title: z.string({ required_error: "Group name is required" }).min(1, "Group name is required"),
  numberOfStudents: z.coerce.number({ required_error: "Number of students is required" }).min(1, "Number of students is required"),
  courseName: z.string({ required_error: "Course name is required" }).min(1, "Course name is required"),
  grades: z.array(z.string({ required_error: "Grade is required" }), { required_error: "At least one grade is required" }).min(1, "At least one grade is required"),
  type: z.string().optional(),
  otherInformation: z.string().optional(),
  similarity: z.coerce.number().min(0, "Similarity must be between 0 and 5").max(5, "Similarity must be between 0 and 5").optional(),
});

export const schema = z.object({
  // Step 1
  title: z.string({ required_error: "Title is required" }).min(1, "Title is required"),
  description: z.string({ required_error: "Description is required" }).min(1, "Description is required"),
  impact: z.string({ required_error: "Impact is required" }).min(1, "Impact is required"),
  // Step 2 execution steps atleast 2 steps
  executionSteps: z.array(
    z.string({ required_error: "Steps are required to be filled" }).refine(
      (text) => {
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        return wordCount >= 5;
      },
      { message: "Each step must be at least 5 words" },
    ),
  ).min(2, "At least 2 steps are required (start and end)"),
  // Step 3
  isMultipleGroup: z.boolean({ required_error: "Please select whether the strategy is for a single group or multiple groups" }),
  // Step 4 (included in the schema)
  comparisonMethod: z.string({ required_error: "Comparison method is required" }).min(1, "Comparison method is required"),
  // Step 5
  groupInformation: z.array(groupInformationSchema, { required_error: "At least one group is required" }).min(1, "At least one group is required"),
  // Step 6
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid start date" }) }),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid end date" }) }),
  strategyFrequency: z.string({ required_error: "Strategy frequency is required" }).min(1, "Strategy frequency is required"),
  strategyDuration: z.string({ required_error: "Strategy duration is required" }).min(1, "Strategy duration is required"),
  strategyUsage: z.array(z.string({ required_error: "Strategy usage is required" }), { required_error: "At least one strategy usage is required" }).min(1, "At least one strategy usage is required"),
  // Step 7
  assessmentName: z.string({ required_error: "Assessment name is required" }).min(1, "Assessment name is required"),
  assessmentDescription: z.string({ required_error: "Assessment description is required" }).min(1, "Assessment description is required"),
  preAssessmentDate: z.coerce.date({ errorMap: () => ({ message: "Invalid Pre-assessment date" }) }),
  // only required if isMultipleGroup is true
  midAssessmentDate: z.coerce.string().optional(),
  postAssessmentDate: z.coerce.date({ errorMap: () => ({ message: "Invalid Post-assessment date" }) }),
});

export type FormType = z.infer<typeof schema>;