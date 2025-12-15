// Skills and experience related type definitions

export interface SkillCategory {
  readonly id: string;
  readonly name: string;
  readonly type: 'frontend' | 'management' | 'leadership';
  readonly skills: readonly Skill[];
}

export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly level: number; // 1-10
  readonly yearsOfExperience: number;
  readonly projects: readonly string[];
  readonly description: string;
}

export interface ExperienceItem {
  readonly id: string;
  readonly company: string;
  readonly position: string;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly achievements: readonly string[];
  readonly technologies: readonly string[];
}

export interface SkillShowcaseProps {
  skills: SkillCategory[];
  certifications: import('./brand').Certification[];
  experience: ExperienceItem[];
}

export interface SkillRadarProps {
  categories: SkillCategory[];
  maxLevel: number;
}