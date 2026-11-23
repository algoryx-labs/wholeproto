export const brand = {
  companyName: "Wholesale Calgary",
  shortName: "Wholesale Calgary",
  adminAppName: "Wholesale Calgary Admin",
  b2bAppName: "Wholesale Calgary Trade",
  mobileAppName: "Wholesale Calgary",
  supportEmail: "support@wholesalecalgary.ca",
  supportPhone: "+1 (403) 555-0142",
  currency: "CAD",
  locale: "en-CA",
  taxRate: 0.05,
  taxLabel: "GST",
  logoSrc: "/assets/logo.png",
} as const;

export type Brand = typeof brand;
