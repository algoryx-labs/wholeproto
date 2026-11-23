export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  province: "ON" | "AB";
  postalCode: string;
  country: "CA";
  isDefault?: boolean;
}
