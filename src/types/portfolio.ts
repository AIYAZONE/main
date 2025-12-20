// Portfolio related type definitions

export interface ProjectGroup {
  id: string;
  title: string;
  description: string;
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'digital-garden' | 'featured-work' | 'community';
  techStack: string[];
  status: 'online' | 'development' | 'archived';
  url: string;
  githubUrl?: string;
  imageUrl: string;
  features: string[];
  metrics?: ProjectMetrics;
  size?: 'standard' | 'feature' | 'info';
}

export interface ProjectMetrics {
  visitors?: number;
  stars?: number;
  forks?: number;
  performance?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  category: string;
}

export interface FilterCriteria {
  category?: string;
  techStack?: string[];
  status?: string;
  searchTerm?: string;
}

export interface ProjectDetail extends Project {
  fullDescription: string;
  screenshots: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
}

export interface PortfolioGridProps {
  projects: ProjectGroup[];
  filterOptions: FilterOption[];
}

export interface ProjectCardProps {
  project: Project;
  showDetails?: boolean;
}