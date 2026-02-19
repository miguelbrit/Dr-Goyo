
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  distance: string; // "1.2 km"
  location: string; // "Caracas", "Zulia", etc.
  price: number;
  nextAvailable?: string;
  about?: string;
  experience?: number; // Years
  patients?: number; // Number of patients
  isFeatured?: boolean;
}

export interface Medicament {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image?: string;
  description?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  location: string; // City
  rating: number;
  reviews: number;
  image: string;
  distance: string;
  isOpen: boolean;
  featuredProduct?: {
    name: string;
    price: number;
  };
  inventory?: Medicament[];
  phone?: string;
  hours?: string;
}

export interface LabService {
  id: string;
  name: string;
  price: number;
  preparation: string; // "Ayuno 8 horas"
  duration: string; // "24 horas"
  category?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  image: string;
  distance: string;
  services: LabService[];
  phone?: string;
  hours?: string;
}

export interface LabTest {
  id: string;
  name: string;
  labName: string;
  price: number;
  deliveryTime: string;
  requirements: string[];
}

export interface MedicineProfile {
  id: string;
  name: string;
  category: string; // e.g., "Analgésico"
  description: string;
  dosage: string;
  sideEffects: string[];
  precautions: string;
  image: string;
}

export interface PathologyProfile {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  symptoms: string[];
  causes: string;
  riskFactors: string[];
  specialty: string; // Linked specialty for doctor search
  image: string;
}

// --- Library Admin Types ---

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  specialty: string; // Smart connection
  author: string;
  status: 'published' | 'draft';
  publishDate: string;
  views: number;
  image: string;
  content?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  specialty: string;
}
