import { useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

function parseTypedDate(value: string) {
  const trimmedValue = value.trim();
  const formats = ["MM/dd/yyyy", "M/d/yyyy", "dd/MM/yyyy", "d/M/yyyy"];

  for (const dateFormat of formats) {
    const parsedDate = parse(trimmedValue, dateFormat, new Date());
    if (isValid(parsedDate) && format(parsedDate, dateFormat) === trimmedValue) {
      return parsedDate;
    }
  }

  return undefined;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? format(value, "MM/dd/yyyy") : "");
  const [month, setMonth] = useState(value || new Date());

  useEffect(() => {
    setInputValue(value ? format(value, "MM/dd/yyyy") : "");
    if (value) {
      setMonth(value);
    }
  }, [value]);

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue);

    const typedDate = parseTypedDate(nextValue);
    if (typedDate) {
      setMonth(typedDate);
      setOpen(true);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Popover.Trigger asChild>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => handleInputChange(event.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              if (value) {
                setInputValue(format(value, "MM/dd/yyyy"));
              }
            }}
            placeholder={placeholder === "Pick a date" ? "MM/DD/YYYY" : `${placeholder} (MM/DD/YYYY)`}
            className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left text-slate-900 placeholder:text-slate-500"
          />
        </Popover.Trigger>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Open calendar"
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
      </div>
      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50"
          align="start"
          sideOffset={5}
        >
          <DayPicker
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange(date);
              if (date) {
                setInputValue(format(date, "MM/dd/yyyy"));
                setMonth(date);
              }
              setOpen(false);
            }}
            className="rdp-custom"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
