export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';

export type ProjectDocumentCategory = 'blueprint' | 'permit' | 'contract' | 'other';

export interface ProjectDocument {
  key: string;
  fileName: string;
  category: ProjectDocumentCategory;
  contentType: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  description?: string;
  documents?: ProjectDocument[];
  createdAt: string;
  updatedAt: string;
  costSummary?: ProjectCostSumamry
}

export interface CreateProjectInput {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  description?: string;
  
}

export interface ProjectCostSumamry {
  projectId: string;
  budget: number;
  materialCost: number;
  labourCost: number;
  otherCost: number;
  totalCost: number;
  remaining: number;
  isOverBudget: boolean;
  updatedAt: string;
}
