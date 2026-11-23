export const brand = {
  companyName: "Westwinds Wholesale",
  shortName: "Westwinds",
  adminAppName: "Calgary Wholesale Admin",
  b2bAppName: "Calgary Wholesale Cash N Carry",
  mobileAppName: "Westwinds",
  supportEmail: "support@calgarywholesale.ca",
  supportPhone: "+1 (905) 555-0142",
  currency: "CAD",
  locale: "en-CA",
  taxRate: 0.13,
  taxLabel: "HST",
} as const;

export type Brand = typeof brand;
