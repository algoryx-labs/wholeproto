export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  province: "ON";
  postalCode: string;
  country: "CA";
  isDefault?: boolean;
}
