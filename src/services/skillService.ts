import type { SkillCategory, Skill, ExperienceItem } from '../types/skills';
import type { ApiResponse } from '../types/common';
import skillsData from '../data/skills.json';
import i18n from '../i18n';

export interface SkillService {
	getSkillCategories(): Promise<SkillCategory[]>;
	getSkillsByCategory(
		categoryType: 'frontend' | 'management' | 'leadership'
	): Promise<SkillCategory>;
	getExperienceItems(): Promise<ExperienceItem[]>;
	getSkillsByLevel(minLevel: number): Promise<Skill[]>;
	searchSkills(query: string): Promise<Skill[]>;
}

class SkillServiceImpl implements SkillService {
	private baseUrl = '/api/skills';

	async getSkillCategories(): Promise<SkillCategory[]> {
		try {
			// TODO: Replace with actual API call when backend is available
			// const response = await fetch(`${this.baseUrl}/categories`);
			// const result: ApiResponse<SkillCategory[]> = await response.json();

			// Use local data for now
			return skillsData.skillCategories.map(category => ({
				...category,
				name: i18n.global.t(`skills.categories.${category.id}.name`),
				skills: category.skills.map(skill => ({
					...skill,
					name: i18n.global.t(`skills.categories.${category.id}.skills.${skill.id}.name`),
					description: i18n.global.t(`skills.categories.${category.id}.skills.${skill.id}.description`),
					projects: i18n.global.tm(`skills.categories.${category.id}.skills.${skill.id}.projects`) as string[]
				}))
			})) as SkillCategory[];
		} catch (error) {
			throw new Error(`Failed to fetch skill categories: ${error}`);
		}
	}

	async getSkillsByCategory(
		categoryType: 'frontend' | 'management' | 'leadership'
	): Promise<SkillCategory> {
		try {
			const categories = await this.getSkillCategories();
			const category = categories.find(
				(cat) => cat.type === categoryType
			);

			if (!category) {
				throw new Error(`Category ${categoryType} not found`);
			}

			return category;
		} catch (error) {
			throw new Error(`Failed to fetch skills by category: ${error}`);
		}
	}

	async getExperienceItems(): Promise<ExperienceItem[]> {
		try {
			// TODO: Replace with actual API call when backend is available
			// const response = await fetch(`${this.baseUrl}/experience`);
			// const result: ApiResponse<ExperienceItem[]> = await response.json();

			// Use local data for now and convert date strings to Date objects
			return skillsData.experienceItems.map((item) => ({
				...item,
				company: i18n.global.t(`skills.experience.${item.id}.company`),
				position: i18n.global.t(
					`skills.experience.${item.id}.position`
				),
				achievements: i18n.global.tm(
					`skills.experience.${item.id}.achievements`
				) as string[],
				startDate: new Date(item.startDate),
				endDate: item.endDate ? new Date(item.endDate) : undefined
			})) as ExperienceItem[];
		} catch (error) {
			throw new Error(`Failed to fetch experience items: ${error}`);
		}
	}

	async getSkillsByLevel(minLevel: number): Promise<Skill[]> {
		try {
			const categories = await this.getSkillCategories();
			const allSkills = categories.flatMap((category) => category.skills);

			return allSkills.filter((skill) => skill.level >= minLevel);
		} catch (error) {
			throw new Error(`Failed to fetch skills by level: ${error}`);
		}
	}

	async searchSkills(query: string): Promise<Skill[]> {
		try {
			const categories = await this.getSkillCategories();
			const allSkills = categories.flatMap((category) => category.skills);

			const lowercaseQuery = query.toLowerCase();
			return allSkills.filter(
				(skill) =>
					skill.name.toLowerCase().includes(lowercaseQuery) ||
					skill.description.toLowerCase().includes(lowercaseQuery) ||
					skill.projects.some((project) =>
						project.toLowerCase().includes(lowercaseQuery)
					)
			);
		} catch (error) {
			throw new Error(`Failed to search skills: ${error}`);
		}
	}

	// Helper method to categorize skills for display logic
	categorizeSkillsForDisplay(skills: SkillCategory[]): {
		frontend: SkillCategory;
		management: SkillCategory;
		leadership: SkillCategory;
	} {
		const frontend = skills.find((cat) => cat.type === 'frontend');
		const management = skills.find((cat) => cat.type === 'management');
		const leadership = skills.find((cat) => cat.type === 'leadership');

		if (!frontend || !management || !leadership) {
			throw new Error('Missing required skill categories');
		}

		return { frontend, management, leadership };
	}

	// Helper method to get skills summary for display
	getSkillsSummary(skills: SkillCategory[]): {
		totalSkills: number;
		averageLevel: number;
		topSkills: Skill[];
		experienceYears: number;
	} {
		const allSkills = skills.flatMap((category) => category.skills);
		const totalSkills = allSkills.length;
		const averageLevel =
			allSkills.reduce((sum, skill) => sum + skill.level, 0) /
			totalSkills;
		const topSkills = allSkills
			.filter((skill) => skill.level >= 8)
			.sort((a, b) => b.level - a.level)
			.slice(0, 5);
		const experienceYears = Math.max(
			...allSkills.map((skill) => skill.yearsOfExperience)
		);

		return {
			totalSkills,
			averageLevel: Math.round(averageLevel * 10) / 10,
			topSkills,
			experienceYears
		};
	}
}

export const skillService = new SkillServiceImpl();
