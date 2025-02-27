export interface OrderData {
  // Step 1
  projectType: "A" | "B" | "C" | "D" | "";
  
  // Step 2
  projectName: string;
  platform: "Web" | "Mobile" | "Multiplatform" | "";
  applicationType: string;
  referenceLink?: string;

  // Step 3 (Tugas Harian)
  simpleStack?: {
    framework: "noframework" | "withframework" | "recommendation";
    technologies: string[];
  };

  // Step 3 (Ujikom & PKL)
  roles?: string[];
  developmentMethod?: "fullstack" | "mixmatch";
  fullstackChoice?: {
    framework: string;
    database: string;
  };
  mixmatchChoice?: {
    frontend: string;
    backend: string;
    api: string;
    database: string;
  };
  uiFramework?: string[];
  themeChoice?: {
    mode: "light" | "dark" | "auto" | "custom";
    style?: string;
  };
  notificationType?: string;
  customColors?: {
    count: number;
    colors: string[];
  };
  deadline?: string;

  // Step 4
  customerName: string;
  whatsappNumber: string;
  paymentMethod: "DANA" | "OVO" | "GOPAY" | "";
  
  // Calculations
  basePrice?: number;
  additionalCosts?: {
    [key: string]: number;
  };
  discount?: number;
  totalPrice?: number;
}

export interface PriceList {
  roles: {
    [key: string]: number;
  };
  fullstackFrameworks: {
    [key: string]: number;
  };
  databases: {
    [key: string]: number;
  };
  frontends: {
    [key: string]: number;
  };
  backends: {
    [key: string]: number;
  };
  apis: {
    [key: string]: number;
  };
  uiFrameworks: {
    [key: string]: number;
  };
  notifications: {
    [key: string]: number;
  };
  deadlines: {
    [key: string]: number;
  };
} 