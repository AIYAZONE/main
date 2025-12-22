// Brand related type definitions

export interface BrandInfo {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  intro: string;
  profileImage: string;
  location: string;
  age: number;
  experience: number;
  tagline: string;
  valueProposition: string[];
}

export interface Certification {
  readonly id: string;
  readonly name: string;
  readonly issuer: string;
  readonly issueDate: Date;
  readonly expiryDate?: Date;
  readonly credentialId: string;
  readonly imageUrl: string;
  readonly verificationUrl: string;
}

export interface StorySection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'achievement' | 'milestone' | 'transition' | 'education';
}

export interface BrandHeroProps {
  title: string;
  subtitle: string;
  intro: string;
  profileImage?: string;
  certifications: Certification[];
}

export interface BrandStoryProps {
  story: StorySection[];
  timeline: TimelineEvent[];
  philosophy: string[];
}