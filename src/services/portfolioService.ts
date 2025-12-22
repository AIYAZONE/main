import type {
	ProjectGroup,
	Project,
	ProjectDetail,
	FilterCriteria
} from '../types/portfolio';
import type { ApiResponse } from '../types/common';
import { cache, CACHE_KEYS, CACHE_CONFIGS } from './cacheService';
import portfolioData from '../data/portfolio.json';
import i18n from '../i18n';

export interface PortfolioService {
	getProjects(): Promise<ProjectGroup[]>;
	getProjectDetails(id: string): Promise<ProjectDetail>;
	syncExternalProjects(): Promise<void>;
	filterProjects(criteria: FilterCriteria): Promise<Project[]>;
}

class PortfolioServiceImpl implements PortfolioService {
	private baseUrl = '/api/portfolio';

	async getProjects(): Promise<ProjectGroup[]> {
		return cache.getOrSet(
			CACHE_KEYS.PORTFOLIO_DATA,
			async () => {
				try {
					// TODO: Replace with actual API call when backend is available
					// const response = await fetch(`${this.baseUrl}/projects`);
					// const result: ApiResponse<ProjectGroup[]> = await response.json();

					// Use local data for now
					return portfolioData.projectGroups.map((group) => ({
						...group,
						title: i18n.global.t(
							`projectData.groups.${group.id}.title`
						),
						description: i18n.global.t(
							`projectData.groups.${group.id}.description`
						),
						projects: group.projects.map((project) => ({
							...project,
							name: i18n.global.t(
								`projectData.projects.${project.id}.name`
							),
							description: i18n.global.t(
								`projectData.projects.${project.id}.description`
							),
							features: i18n.global.tm(
								`projectData.projects.${project.id}.features`
							) as string[]
						}))
					})) as ProjectGroup[];
				} catch (error) {
					throw new Error(`Failed to fetch projects: ${error}`);
				}
			},
			CACHE_CONFIGS.MEDIUM
		);
	}

	async getProjectDetails(id: string): Promise<ProjectDetail> {
		return cache.getOrSet(
			`${CACHE_KEYS.PORTFOLIO_DATA}_detail_${id}`,
			async () => {
				try {
					// TODO: Replace with actual API call
					// const response = await fetch(`${this.baseUrl}/projects/${id}`);
					// const result: ApiResponse<ProjectDetail> = await response.json();

					// Mock data for now
					const projects = await this.getProjects();
					const project = projects
						.flatMap((group) => group.projects)
						.find((p) => p.id === id);

					if (!project) {
						throw new Error(`Project with id ${id} not found`);
					}

					return {
						...project,
						fullDescription: i18n.global.t(`projectData.projects.${id}.fullDescription`),
						screenshots: [
							`/assets/images/${project.name.toLowerCase()}-screenshot-1.jpg`,
							`/assets/images/${project.name.toLowerCase()}-screenshot-2.jpg`
						],
						challenges: i18n.global.tm(`projectData.projects.${id}.challenges`) as string[],
						solutions: i18n.global.tm(`projectData.projects.${id}.solutions`) as string[],
						learnings: i18n.global.tm(`projectData.projects.${id}.learnings`) as string[]
					};
				} catch (error) {
					throw new Error(
						`Failed to fetch project details: ${error}`
					);
				}
			},
			CACHE_CONFIGS.LONG
		);
	}

	async syncExternalProjects(): Promise<void> {
		try {
			// TODO: Implement GitHub API integration to sync stars, forks, etc.
			console.log('Syncing external projects from GitHub...');

			// Mock implementation for now - simulate API calls
			const projects = await this.getProjects();
			const projectsWithGitHub = projects
				.flatMap((group) => group.projects)
				.filter((project) => project.githubUrl);

			console.log(
				`Found ${projectsWithGitHub.length} projects with GitHub URLs to sync`
			);

			// Simulate updating metrics from external sources
			for (const project of projectsWithGitHub) {
				if (project.metrics) {
					// Mock GitHub API response
					const mockGitHubData = {
						stars:
							project.metrics.stars ||
							Math.floor(Math.random() * 100) + 10,
						forks:
							project.metrics.forks ||
							Math.floor(Math.random() * 20) + 1,
						updated_at: new Date().toISOString()
					};

					// Mock analytics data
					const mockAnalyticsData = {
						visitors:
							project.metrics.visitors ||
							Math.floor(Math.random() * 5000) + 100
					};

					console.log(
						`Updated ${project.name}: ${mockGitHubData.stars} stars, ${mockGitHubData.forks} forks, ${mockAnalyticsData.visitors} visitors`
					);
				}
			}

			console.log('External project sync completed');
		} catch (error) {
			throw new Error(`Failed to sync external projects: ${error}`);
		}
	}

	async filterProjects(criteria: FilterCriteria): Promise<Project[]> {
		try {
			const allProjects = await this.getProjects();
			const flatProjects = allProjects.flatMap((group) => group.projects);

			return flatProjects.filter((project) => {
				if (
					criteria.category &&
					project.category !== criteria.category
				) {
					return false;
				}

				if (criteria.status && project.status !== criteria.status) {
					return false;
				}

				if (criteria.techStack && criteria.techStack.length > 0) {
					const hasMatchingTech = criteria.techStack.some((tech) =>
						project.techStack.includes(tech)
					);
					if (!hasMatchingTech) {
						return false;
					}
				}

				if (criteria.searchTerm) {
					const searchLower = criteria.searchTerm.toLowerCase();
					const matchesSearch =
						project.name.toLowerCase().includes(searchLower) ||
						project.description
							.toLowerCase()
							.includes(searchLower) ||
						project.techStack.some((tech) =>
							tech.toLowerCase().includes(searchLower)
						);
					if (!matchesSearch) {
						return false;
					}
				}

				return true;
			});
		} catch (error) {
			throw new Error(`Failed to filter projects: ${error}`);
		}
	}

	// Helper method to categorize projects for display logic
	categorizeProjectsForDisplay(projectGroups: ProjectGroup[]): {
		digitalGarden: ProjectGroup;
		featuredWork: ProjectGroup;
		community: ProjectGroup;
	} {
		const digitalGarden = projectGroups.find(
			(group) => group.id === 'digital-garden'
		);
		const featuredWork = projectGroups.find(
			(group) => group.id === 'featured-work'
		);
		const community = projectGroups.find(
			(group) => group.id === 'community'
		);

		if (!digitalGarden || !featuredWork || !community) {
			throw new Error('Missing required project categories');
		}

		return { digitalGarden, featuredWork, community };
	}

	// Helper method to get projects by category
	getProjectsByCategory(
		projectGroups: ProjectGroup[],
		category: 'digital-garden' | 'featured-work' | 'community'
	): Project[] {
		const group = projectGroups.find((g) => g.id === category);
		return group ? group.projects : [];
	}

	// Helper method to get project statistics
	getProjectStatistics(projectGroups: ProjectGroup[]): {
		totalProjects: number;
		onlineProjects: number;
		developmentProjects: number;
		totalStars: number;
		totalVisitors: number;
		topTechnologies: { name: string; count: number }[];
	} {
		const allProjects = projectGroups.flatMap((group) => group.projects);

		const totalProjects = allProjects.length;
		const onlineProjects = allProjects.filter(
			(p) => p.status === 'online'
		).length;
		const developmentProjects = allProjects.filter(
			(p) => p.status === 'development'
		).length;

		const totalStars = allProjects.reduce(
			(sum, project) => sum + (project.metrics?.stars || 0),
			0
		);
		const totalVisitors = allProjects.reduce(
			(sum, project) => sum + (project.metrics?.visitors || 0),
			0
		);

		// Calculate top technologies
		const techCount = new Map<string, number>();
		allProjects.forEach((project) => {
			project.techStack.forEach((tech) => {
				techCount.set(tech, (techCount.get(tech) || 0) + 1);
			});
		});

		const topTechnologies = Array.from(techCount.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		return {
			totalProjects,
			onlineProjects,
			developmentProjects,
			totalStars,
			totalVisitors,
			topTechnologies
		};
	}

	// Helper method to get featured projects (high-impact projects)
	getFeaturedProjects(projectGroups: ProjectGroup[]): Project[] {
		const allProjects = projectGroups.flatMap((group) => group.projects);

		return allProjects
			.filter(
				(project) =>
					(project.status === 'online' &&
						(project.metrics?.stars || 0) > 20) ||
					(project.metrics?.visitors || 0) > 1000
			)
			.sort((a, b) => {
				const aScore =
					(a.metrics?.stars || 0) + (a.metrics?.visitors || 0) / 100;
				const bScore =
					(b.metrics?.stars || 0) + (b.metrics?.visitors || 0) / 100;
				return bScore - aScore;
			})
			.slice(0, 6);
	}

	// Helper method to get project by ID across all groups
	getProjectById(
		projectGroups: ProjectGroup[],
		projectId: string
	): Project | null {
		for (const group of projectGroups) {
			const project = group.projects.find((p) => p.id === projectId);
			if (project) {
				return project;
			}
		}
		return null;
	}

	// Helper method to get related projects based on tech stack
	getRelatedProjects(
		projectGroups: ProjectGroup[],
		currentProject: Project,
		limit: number = 3
	): Project[] {
		const allProjects = projectGroups
			.flatMap((group) => group.projects)
			.filter((p) => p.id !== currentProject.id);

		return allProjects
			.map((project) => ({
				project,
				similarity: this.calculateTechStackSimilarity(
					currentProject.techStack,
					project.techStack
				)
			}))
			.filter((item) => item.similarity > 0)
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, limit)
			.map((item) => item.project);
	}

	// Helper method to calculate tech stack similarity
	private calculateTechStackSimilarity(
		stack1: string[],
		stack2: string[]
	): number {
		const set1 = new Set(stack1.map((tech) => tech.toLowerCase()));
		const set2 = new Set(stack2.map((tech) => tech.toLowerCase()));

		const intersection = new Set(
			[...set1].filter((tech) => set2.has(tech))
		);
		const union = new Set([...set1, ...set2]);

		return intersection.size / union.size; // Jaccard similarity
	}
}

export const portfolioService = new PortfolioServiceImpl();
