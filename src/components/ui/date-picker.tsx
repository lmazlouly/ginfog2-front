"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  onChange?: (date: Date | undefined) => void
  defaultValue?: Date
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  onChange,
  defaultValue,
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  React.useEffect(() => {
    if (!!defaultValue && !date) {
      setDate(defaultValue)
    }
  }, [defaultValue, date])

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={defaultValue || date}
            onSelect={setDate}
            disabled={(date) => {
              // Disable dates before minDate
              if (minDate && date < minDate) return true;
              // Disable dates after maxDate
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
