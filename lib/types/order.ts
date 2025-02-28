export interface OrderData {
  // User Info
  userId?: string;
  customerName: string;
  whatsappNumber: string;
  paymentMethod: string;

  // Project Info
  projectType: string;
  platform: string;
  projectName: string;
  applicationType: string;
  referenceLink?: string;

  // Development Info
  developmentMethod?: 'fullstack' | 'mixmatch';
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
  roles?: string[];
  uiFramework?: string[];
  themeChoice?: {
    mode: string;
  };
  notificationType?: string;
  customColors?: {
    colors: string[];
  };

  // Additional Info
  deadline?: string;
  notes?: string;

  // Price Info
  originalPrice?: number;
  finalPrice?: number;
  discount?: number;

  // Metadata
  status?: string;
  createdAt?: any;
  lastUpdated?: any;
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
} ``