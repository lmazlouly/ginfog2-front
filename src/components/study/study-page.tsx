"use client";
import withRole from "@/components/auth/with-role";
import Stepper from "@/components/ui/stepper";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormType, schema } from "@/components/study/types";
// steps
import { Step1 } from "@/components/study/step1";
import { Step2 } from "@/components/study/step2";
import { Step3 } from "@/components/study/step3";
import { Step4 } from "@/components/study/step4";
import { Step5 } from "@/components/study/step5";
import { Step6 } from "@/components/study/step6";
import { Step7 } from "@/components/study/step7";
import EnhancedSummaryVisual from "@/components/study/preview";
import {
  // CreateStudyBodyBody as CreateStudyModel,
  CreateStudy200 as StudyModel,
  GetStrategyById200 as StrategyModel
} from "@/lib/api/models";
import { createStudy, updateStudy } from "@/lib/api/generated/study/study";
import { useGetGrades } from "@/lib/api/generated/grades/grades";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";

function StudyPage({ strategy, currentStudy }: { strategy: StrategyModel, currentStudy?: StudyModel }) {
  const grades = useGetGrades();
  const router = useRouter();

  const [missingSteps, setMissingSteps] = useState<Array<number>>([]);
  const [completedSteps, setCompletedSteps] = useState<Array<number>>([]);
  const [study, setStudy] = useState<StudyModel | undefined>(currentStudy);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: study as unknown as FormType || {
      // Initalizing some values
      executionSteps: ["", ""],
      isMultipleGroup: false,
    },
    disabled: isLoading || currentStudy?.status === "PUBLISHED"
  });

  const { toast } = useToast();

  const onSubmit = async (study: FormType) => {
    const midAssessmentDate = form.getValues("midAssessmentDate");
    if (!form.getValues("isMultipleGroup") && (!midAssessmentDate || midAssessmentDate.length === 0)) {
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all the required fields.",
      });
    }

    setLoading(true);
    const studyToPublish = study as unknown as StudyModel;
    studyToPublish.strategyId = strategy.id as string;
    studyToPublish.status = "PUBLISHED";
    (Object.keys(studyToPublish) as Array<keyof StudyModel>).forEach((key) => {
      if (studyToPublish[key] === '') {
        delete studyToPublish[key];
      }
    });
    await updateStudy(currentStudy?.id as string, studyToPublish)
      .then((res) => { 
        setStudy(res); 
        form.reset(res as unknown as FormType);
        setShowSuccessDialog(true); // Show success dialog
      })
      .catch(console.error);
    setLoading(false);
  };

  const handleNextStepClicked = async (nextStep: number) => {
    const currentStep = nextStep - 1;
    switch (currentStep) {
      // Step 1: Explain the purpose
      case 0:
        verifyStep(0, ["title", "description", "impact"]);
        break;
      // Step 2: Execution Steps
      case 1:
        verifyStep(1, ["executionSteps"]);
        break;
      // Step 3: Design Group (Single or Multiple)
      case 2:
        verifyStep(2, ["isMultipleGroup"]);
        break;
      // Step 4: Strategy Comparison Conditions
      case 3:
        verifyStep(3, ["comparisonMethod"]);
        break;
      // Step 5: Class/Group Details
      case 4:
        verifyStep(4, [
          !form.getValues("isMultipleGroup") ? "groupInformation.0" : "groupInformation",
        ] as Array<keyof FormType>);
        break;
      // Step 6: Strategy Comparison Conditions
      case 5:
        verifyStep(5, ["startDate", "endDate", "strategyFrequency", "strategyDuration", "strategyUsage"]);
        break;
      // Step 7: Assessment Planning
      case 6:
        verifyStep(6, ["assessmentName", "assessmentDescription", "preAssessmentDate", "midAssessmentDate", "postAssessmentDate"]);
        break;
      default:
        form.handleSubmit(onSubmit, () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill in all the required fields.",
          });
        })();
        break;
    }
  }

  const handleSaveDraft = async (step?: number) => {
    const currentStep = step ? step : 0;
    setLoading(true);
    const formData = form.getValues() as unknown as StudyModel;
    (Object.keys(formData) as Array<keyof StudyModel>).forEach((key) => {
      if (formData[key] === '') {
        delete formData[key];
      }
    });
    if (!study) {
      formData.strategyId = strategy.id as string;
      formData.currentStep = formData.currentStep && (formData.currentStep > currentStep) ? formData.currentStep : step;
      await createStudy(formData).then((res) => { setStudy(res); form.reset(res as unknown as FormType); }).catch(console.error);
    } else {
      formData.currentStep = formData.currentStep && (formData.currentStep > currentStep) ? formData.currentStep : step;
      await updateStudy(formData.id as string, formData).then((res) => { setStudy(res); form.reset(res as unknown as FormType); }).catch(console.error);
    }
    setLoading(false);
    toast({
      variant: "default",
      title: "Success",
      description: "Study has been saved as a draft successfully!",
      // position: "top-left",
      duration: 1800
    });

  }

  const verifyStep = async (
    step: number,
    fields: Array<keyof FormType>,
  ) => {
    const results = await form.trigger(fields);
    if (!results) {
      setMissingSteps([...missingSteps.filter((s) => s !== step), step]);
      setCompletedSteps(completedSteps.filter((s) => s !== step));
      // console.log(`Step ${step} is not valid`);
    } else {
      setMissingSteps(missingSteps.filter((s) => s !== step));
      setCompletedSteps([...completedSteps.filter((s) => s !== step), step]);
    }
  }

  useEffect(() => {
    if (currentStudy?.status === "PUBLISHED") {
      setMissingSteps([]);
      setCompletedSteps([0, 1, 2, 3, 4, 5, 6, 7]);
      return;
    }

    const verifyAllToCurrentStep = async () => {
      const tempMissingSteps: Array<number> = [];
      const tempVerifiedSteps: Array<number> = [];
      for (let i = 0; i < currentStudy!.currentStep!; i++) {
        switch (i) {
          // Step 1: Explain the purpose
          case 0:
            // fieldsToVerify.push(["title", "description", "impact"]);
            await form.trigger(["title", "description", "impact"]).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            })
            break;
          // Step 2: Execution Steps
          case 1:
            await form.trigger(["executionSteps"]).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            });
            break;
          // Step 3: Design Group (Single or Multiple)
          case 2:
            await form.trigger(["isMultipleGroup"]).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            });
            break;
          // Step 4: Strategy Comparison Conditions
          case 3:
            await form.trigger(["comparisonMethod"]).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            });
            break;
          // Step 5: Class/Group Details
          case 4:
            await form.trigger([!form.getValues("isMultipleGroup") ? "groupInformation.0" : "groupInformation"]).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            });
            break;
          // Step 6: Strategy Comparison Conditions
          case 5:
            await form.trigger(["startDate", "endDate", "strategyFrequency", "strategyDuration", "strategyUsage"]).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            });
            break;
          // Step 7: Assessment Planning
          case 6:
            await form.trigger(
              form.getValues("isMultipleGroup") ?
                ["assessmentName", "assessmentDescription", "preAssessmentDate", "midAssessmentDate", "postAssessmentDate"] :
                ["assessmentName", "assessmentDescription", "preAssessmentDate", "postAssessmentDate"]
            ).then((results) => {
              if (!results) tempMissingSteps.push(i);
              else tempVerifiedSteps.push(i);
            });
            break;
          default:
            // form.handleSubmit(onSubmit)();
            break;
        }
      }

      setMissingSteps(tempMissingSteps);
      setCompletedSteps(tempVerifiedSteps);
    }

    if (currentStudy?.currentStep && currentStudy.currentStep > 0) {
      // loop to the current step and verify each step
      verifyAllToCurrentStep();
    }

    form.setValue("groupInformation.0", currentStudy?.groupInformation?.find((g) => g.type === "EXPERIMENTAL") as unknown as FormType["groupInformation"][0]);
    if (currentStudy?.isMultipleGroup)
      form.setValue("groupInformation.1", currentStudy?.groupInformation?.find((g) => g.type === "COMPARISON") as unknown as FormType["groupInformation"][1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStudy]);

  // useEffect(() => {
  //   const timeout = setTimeout(async () => {
  //     const currentSnapshot = JSON.stringify(form.getValues());
  //     const originalSnapshot = JSON.stringify(study);
  //     // const isValid = await form.trigger();

  //     if (currentSnapshot !== originalSnapshot) {
  //       try {
  //         toast({
  //           title: "Auto-saving draft",
  //           description: "Your changes are being saved in the background.",
  //           variant: "default",
  //           duration: 5000,
  //         });
  //         await handleSaveDraft();
  //         toast({
  //           title: "Auto-save successful",
  //           description: "Your changes have been saved successfully.",
  //           variant: "success",
  //         });
  //       } catch (err) {
  //         console.error("Auto-save failed", err);
  //       }
  //     }
  //   }, 5000);

  //   return () => clearTimeout(timeout);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [form.watch()]);

  // Handle refresh page
  const handleRefresh = () => {
    window.location.reload();
  };

  // Handle navigation to cycle page
  const handleGoToCycle = () => {
    router.push(`${window.location.pathname}/cycle`);
  };

  return <>
    {/* Success Dialog */}
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Study Published Successfully!</DialogTitle>
          <DialogDescription>
            Your study has been published and is now available in the study cycle.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button onClick={handleGoToCycle}>Go to Study Cycle</Button>
          <Button variant="outline" onClick={handleRefresh}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-4">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Plan a Study</h1>

        <div className="inline-flex mx-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-orange-200 hover:bg-orange-50 transition-colors duration-200 group">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-orange-100 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11c0 .332.22.624.546.721.857.198 1.74.3 2.654.3a7.462 7.462 0 004.05-1.268V4.065z" />
              </svg>
            </div>

            <Link
              href={`/strategies/${strategy?.id}`}
              target="_blank"
              className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-200 flex items-center"
            >
              {strategy?.title}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper
            stepLabels={[
              "Study Purpose", // Step 1
              "Execution Plan", // Step 2
              "Experiment Details", // Step 3
              "Comparison Conditions", // Step 4
              "Class Details", // Step 5
              "Implementation", // Step 6
              "Assessment Planning", // Step 7
              "Preview", // Step 8
            ]}
            initialStep={study?.currentStep || 0}
            onNext={(step) => handleNextStepClicked(step)}
            onSaveDraft={(step) => handleSaveDraft(step)}
            errorSteps={missingSteps}
            completedSteps={completedSteps}
            isLoading={isLoading}
            submitButtonsDisabled={currentStudy?.status === "PUBLISHED"}
            showButtons={currentStudy?.status != "PUBLISHED"}
          >

            {/* Step 1: Explain the purpose */}
            <Step1 form={form} />
            {/* Step 2: Execution Plan */}
            <Step2 form={form} />
            {/* Step 3: Experiment Design */}
            <Step3 form={form} />
            {/* Step 4: Comparison Conditions */}
            <Step4 form={form} />
            {/* Step 5: Class/Group Details */}
            <>
              {grades.data && <Step5 form={form} grades={grades.data} />}
            </>
            {/* Step 6: Implementation Frequency & Duration */}
            <Step6 form={form} />
            {/* Step7: Assessment Planning */}
            <Step7 form={form} />
            {/* Step 8: Check-In */}
            <EnhancedSummaryVisual form={form} strategy={strategy} />
          </Stepper>
        </form>
      </Form>

    </div>
  </>
}
export default withRole(StudyPage, 'teacher');
