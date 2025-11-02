import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface EnhancedTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const EnhancedTimePicker = ({ value, onChange, label, className = "" }: EnhancedTimePickerProps) => {
  // Generate time slots from 9:00 AM to 5:30 PM in 30-minute increments
  const generateTimeSlots = () => {
    const slots: { value: string; label: string }[] = [];
    
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip 5:30 PM onwards
        if (hour === 17 && minute > 30) continue;
        
        const hourNum = hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        
        const timeString = `${displayHour}:${displayMinute} ${period}`;
        const valueString = `${hourNum.toString().padStart(2, '0')}:${displayMinute}`;
        
        slots.push({
          value: valueString,
          label: timeString,
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium mb-2 block">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <SelectValue placeholder="Select time" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {timeSlots.map((slot) => (
            <SelectItem key={slot.value} value={slot.value}>
              {slot.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
