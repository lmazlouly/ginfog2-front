import { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Save } from "lucide-react"

interface StepperProps {
  children: ReactNode[]
  stepLabels?: string[]
  initialStep?: number
  onNext?: (step: number) => Promise<void>,
  onSaveDraft?: (step: number) => Promise<void>,
  // onSetStep?: (previousStep: number, step: number) => void,
  errorSteps?: number[]
  completedSteps?: number[]
  isLoading?: boolean
  submitButtonsDisabled?: boolean
  showButtons?: boolean
}

export default function Stepper({
  children,
  stepLabels,
  initialStep = 0,
  onNext,
  onSaveDraft,
  // onSetStep,
  errorSteps,
  completedSteps,
  isLoading = false,
  submitButtonsDisabled = false,
  showButtons = true
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = children.length

  const moveToStep = (step: number) => {
    setCurrentStep(step)
  }

  const nextStep = async () => {
    if (onNext) {
      await onNext(currentStep + 1)
    }

    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const getStepClass = (step: number) => {
    if (step === currentStep) return "bg-primary text-white border-2 border-primary shadow-md";
    if (errorSteps?.includes(step)) return "bg-orange-400 text-white border-2 border-orange-500";
    if (completedSteps?.includes(step)) return "bg-green-500 text-white border-2 border-green-600";
    return "bg-muted text-muted-foreground border-2 border-gray-300 hover:border-primary/70";
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Step Indicators */}
      <div className="flex justify-between">
        {children.map((_, index) => (
          <div key={index} className="flex-1">
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2",
                "select-none cursor-pointer transition-all duration-300 ease-in-out",
                "hover:scale-105 hover:shadow-md text-base font-medium",
                getStepClass(index)
              )}
              onClick={() => moveToStep(index)}
            >
              {index + 1}
            </div>
            {stepLabels?.[index] && (
              <p className="text-xs text-center">{stepLabels[index]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div>{children[currentStep]}</div>

      {/* Navigation Buttons */}
      {showButtons && <div className="flex justify-between">
        <Button
          className="text-primary"
          type="button"
          variant="white"
          onClick={prevStep}
          disabled={currentStep === 0 || isLoading}
        >
          <ArrowLeft />
          Previous
        </Button>
        <div className="flex gap-2">
          { onSaveDraft &&
            <Button
              type="button"
              variant="primary-outline"
              onClick={() => onSaveDraft(currentStep)}
              disabled={isLoading || submitButtonsDisabled}
              leftIcon={isLoading ? undefined : <Save />}
            >
              { isLoading
                ? "Loading..."
                : "Save Draft"
              }
            </Button>
          }
          <Button
            type="button"
            onClick={nextStep}
            disabled={isLoading || (submitButtonsDisabled && currentStep === totalSteps - 1)}
          >
            { isLoading
              ? "Loading..."
              : currentStep === totalSteps - 1
                ? "Publish"
                : "Next"
            }
          </Button>
        </div>
      </div>}
    </div>
  )
}
