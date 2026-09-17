export interface TimeSlot {
  id: string;
  label: string;
  full: boolean;
}

export interface DaySlots {
  id: string;
  label: string;
  short: string;
  date: string;
  slots: TimeSlot[];
}

const SLOT_LABELS = ["9–11am", "12–2pm", "2–4pm", "4–7pm", "7–9pm"] as const;

export function getDeliveryDays(from = new Date()): DaySlots[] {
  const days: DaySlots[] = [];
  for (let i = 1; i <= 4; i += 1) {
    const d = new Date(from);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const id = d.toISOString().slice(0, 10);
    const weekday = d.toLocaleDateString("en-CA", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    });
    days.push({
      id,
      label: `${weekday} ${monthDay}`,
      short: weekday,
      date: monthDay,
      slots: SLOT_LABELS.map((label, idx) => ({
        id: `${id}-${idx}`,
        label,
        full: (i + idx) % 4 === 0,
      })),
    });
  }
  return days;
}

export function nextOpenSlot(from = new Date()): { day: string; slot: string } {
  const days = getDeliveryDays(from);
  for (const day of days) {
    const open = day.slots.find((s) => !s.full);
    if (open) return { day: day.label, slot: open.label };
  }
  return { day: days[0]!.label, slot: days[0]!.slots[0]!.label };
}