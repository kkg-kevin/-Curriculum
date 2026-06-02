import { useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

function toDayjs(value?: Date) {
  return value ? dayjs(value) : null;
}

function toDate(value: Dayjs | null) {
  if (!value || !value.isValid()) {
    return undefined;
  }

  return value.startOf("day").toDate();
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const [pickerValue, setPickerValue] = useState<Dayjs | null>(() => toDayjs(value));

  useEffect(() => {
    setPickerValue(toDayjs(value));
  }, [value]);

  const handleChange = (nextValue: Dayjs | null) => {
    setPickerValue(nextValue);

    if (nextValue === null) {
      onChange(undefined);
      return;
    }

    if (nextValue.isValid()) {
      onChange(toDate(nextValue));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        value={pickerValue}
        onChange={handleChange}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            placeholder: placeholder === "Pick a date" ? "DD/MM/YYYY" : `${placeholder} DD/MM/YYYY`,
            size: "small",
            sx: {
              "& .MuiInputBase-root": {
                minHeight: 46,
                borderRadius: "0.75rem",
                backgroundColor: "#fff",
                color: "#0f172a",
                fontFamily: "inherit",
                fontSize: "0.875rem",
              },
              "& .MuiInputBase-root:hover": {
                backgroundColor: "#f8fafc",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cbd5e1",
              },
              "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
                borderWidth: 2,
              },
              "& .MuiInputBase-input": {
                padding: "0.625rem 0 0.625rem 1rem",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#64748b",
                opacity: 1,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
