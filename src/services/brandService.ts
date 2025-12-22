import type {
	BrandInfo,
	Certification,
	StorySection,
	TimelineEvent
} from '../types/brand';
import type { ApiResponse } from '../types/common';
import { cache, CACHE_KEYS, CACHE_CONFIGS } from './cacheService';
import brandData from '../data/brand.json';
import i18n from '../i18n';

export interface BrandService {
	getBrandInfo(): Promise<BrandInfo>;
	getPersonalStory(): Promise<{
		story: StorySection[];
		timeline: TimelineEvent[];
		philosophy: string[];
	}>;
	getCertifications(): Promise<Certification[]>;
	updateBrandContent(content: Partial<BrandInfo>): Promise<void>;
}

class BrandServiceImpl implements BrandService {
	private baseUrl = '/api/brand';

	async getBrandInfo(): Promise<BrandInfo> {
		return cache.getOrSet(
			CACHE_KEYS.BRAND_INFO,
			async () => {
				try {
					// TODO: Replace with actual API call when backend is available
					// const response = await fetch(`${this.baseUrl}/info`);
					// const result: ApiResponse<BrandInfo> = await response.json();

					// Use local data for now
					const info = brandData.brandInfo as BrandInfo;

					// Overlay with i18n data
					return {
						...info,
						name: i18n.global.t('brand.name'),
						title: i18n.global.t('brand.title'),
						subtitle: i18n.global.t('brand.subtitle'),
						intro: i18n.global.t('brand.intro', {
							experience: info.experience,
							age: info.age
						}),
						tagline: i18n.global.t('brand.tagline'),
						location: i18n.global.t('brand.location'),
						valueProposition: i18n.global.tm(
							'brand.valueProposition'
						) as string[]
					};
				} catch (error) {
					throw new Error(`Failed to fetch brand info: ${error}`);
				}
			},
			CACHE_CONFIGS.MEDIUM
		);
	}

	async getPersonalStory(): Promise<{
		story: StorySection[];
		timeline: TimelineEvent[];
		philosophy: string[];
	}> {
		try {
			// TODO: Replace with actual API call
			// Get data from i18n
			const storyMap = i18n.global.tm('brand.story') as Record<
				string,
				any
			>;
			const timelineMap = i18n.global.tm('brand.timeline') as Record<
				string,
				any
			>;
			const philosophy = i18n.global.tm('brand.philosophy') as string[];

			// Convert map to array and sort by order (assuming keys are ids)
			const story: StorySection[] = Object.keys(storyMap)
				.map((key) => ({
					id: key,
					title: i18n.global.t(`brand.story.${key}.title`),
					content: i18n.global.t(`brand.story.${key}.content`),
					order: parseInt(key) // Assuming key '1', '2', '3' maps to order
				}))
				.sort((a, b) => a.order - b.order);

			// Convert timeline map to array
			// We need to preserve the original dates from somewhere, or hardcode them here since they are data
			// The original hardcoded data had dates. Let's keep the dates here as they are not locale-specific (usually)
			// but the structure in i18n is just text.
			// We can map the IDs to the dates.

			const timelineDates: Record<string, string> = {
				'1': '2014-01-01',
				'2': '2022-06-15',
				'3': '2023-03-20'
			};

			const timelineTypes: Record<
				string,
				'milestone' | 'achievement' | 'education'
			> = {
				'1': 'milestone',
				'2': 'achievement',
				'3': 'achievement'
			};

			const timeline: TimelineEvent[] = Object.keys(timelineMap)
				.map((key) => ({
					id: key,
					date: new Date(timelineDates[key] || new Date()),
					title: i18n.global.t(`brand.timeline.${key}.title`),
					description: i18n.global.t(
						`brand.timeline.${key}.description`
					),
					type: timelineTypes[key] || 'milestone'
				}))
				.sort((a, b) => a.date.getTime() - b.date.getTime());

			return {
				story,
				timeline,
				philosophy
			};
		} catch (error) {
			throw new Error(`Failed to fetch personal story: ${error}`);
		}
	}

	async getCertifications(): Promise<Certification[]> {
		const certs = brandData.certifications;
		return certs.map((cert) => ({
			...cert,
			issueDate: new Date(cert.issueDate),
			name: i18n.global.t(`brand.certificationsData.${cert.id}.name`),
			issuer: i18n.global.t(`brand.certificationsData.${cert.id}.issuer`)
		})) as Certification[];
	}

	async updateBrandContent(content: Partial<BrandInfo>): Promise<void> {
		try {
			// TODO: Replace with actual API call
			// const response = await fetch(`${this.baseUrl}/info`, {
			//   method: 'PUT',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(content)
			// });

			console.log('Brand content updated:', content);
		} catch (error) {
			throw new Error(`Failed to update brand content: ${error}`);
		}
	}
}

export const brandService = new BrandServiceImpl();
