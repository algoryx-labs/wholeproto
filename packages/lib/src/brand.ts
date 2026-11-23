export const brand = {
  companyName: "Calgary Wholesale",
  shortName: "Calgary Wholesale",
  adminAppName: "Calgary Wholesale Admin",
  b2bAppName: "Calgary Wholesale Cash N Carry",
  mobileAppName: "Calgary Wholesale",
  supportEmail: "support@calgarywholesale.ca",
  supportPhone: "+1 (403) 555-0142",
  currency: "CAD",
  locale: "en-CA",
  taxRate: 0.05,
  taxLabel: "GST",
  logoSrc: "/assets/logo.png",
} as const;

export type Brand = typeof brand;
