// Career and SWOT analysis related type definitions

export interface SWOTData {
  id: string;
  lastUpdated: Date;
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  analysis: SWOTAnalysisResult;
}

export interface SWOTItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface SWOTAnalysisResult {
  keyInsights: string[];
  strategicRecommendations: string[];
  actionItems: ActionItem[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface RoadmapData {
  id: string;
  title: string;
  description: string;
  phases: RoadmapPhase[];
  currentPhase: number;
  targetRole: string;
  targetSalaryRange: string;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  duration: string;
  objectives: string[];
  keyMilestones: Milestone[];
  learningGoals: LearningGoal[];
  deliverables: Deliverable[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  metrics?: string[];
}

export interface LearningGoal {
  id: string;
  category: 'architecture' | 'performance' | 'engineering';
  title: string;
  description: string;
  resources: Resource[];
  practicalProjects: PracticalProject[];
  successCriteria: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'book' | 'course' | 'article' | 'video' | 'documentation';
  url: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PracticalProject {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  outputs: string[];
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  type: 'code' | 'document' | 'presentation' | 'analysis';
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  phases: LearningPhase[];
  totalDuration: string;
}

export interface LearningPhase {
  id: string;
  name: string;
  duration: string;
  focus: 'architecture' | 'performance' | 'engineering';
  goals: LearningGoal[];
  projects: PracticalProject[];
}

export interface CareerRoadmapProps {
  phases: RoadmapPhase[];
  currentPhase: number;
}

export interface SWOTAnalysisProps {
  analysis: SWOTData;
  visualMode: 'quadrant' | 'radar' | 'matrix';
}