import type { BrandInfo, Certification, StorySection, TimelineEvent } from '../types/brand';
import type { ApiResponse } from '../types/common';
import { cache, CACHE_KEYS, CACHE_CONFIGS } from './cacheService';
import brandData from '../data/brand.json';

export interface BrandService {
  getBrandInfo(): Promise<BrandInfo>;
  getPersonalStory(): Promise<{ story: StorySection[]; timeline: TimelineEvent[]; philosophy: string[] }>;
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
          return brandData.brandInfo as BrandInfo;
        } catch (error) {
          throw new Error(`Failed to fetch brand info: ${error}`);
        }
      },
      CACHE_CONFIGS.MEDIUM
    );
  }

  async getPersonalStory(): Promise<{ story: StorySection[]; timeline: TimelineEvent[]; philosophy: string[] }> {
    try {
      // TODO: Replace with actual API call
      return {
        story: [
          {
            id: '1',
            title: '技术起点',
            content: '从前端开发工程师开始，深入学习现代前端技术栈',
            order: 1
          },
          {
            id: '2',
            title: '管理转型',
            content: '获得PMP/ACP认证，开始承担技术管理职责',
            order: 2
          },
          {
            id: '3',
            title: '架构进阶',
            content: '专注前端架构、性能优化和工程化体系建设',
            order: 3
          }
        ],
        timeline: [
          {
            id: '1',
            date: new Date('2014-01-01'),
            title: '开始前端开发职业生涯',
            description: '加入第一家互联网公司，开始前端开发工作',
            type: 'milestone'
          },
          {
            id: '2',
            date: new Date('2022-06-15'),
            title: '获得PMP认证',
            description: '通过项目管理专业人士认证考试',
            type: 'achievement'
          },
          {
            id: '3',
            date: new Date('2023-03-20'),
            title: '获得ACP认证',
            description: '通过敏捷认证从业者考试',
            type: 'achievement'
          }
        ],
        philosophy: [
          '技术与管理并重，深度与广度兼顾',
          '持续学习，拥抱变化',
          '以用户为中心，以价值为导向',
          '团队协作，共同成长'
        ]
      };
    } catch (error) {
      throw new Error(`Failed to fetch personal story: ${error}`);
    }
  }

  async getCertifications(): Promise<Certification[]> {
    return cache.getOrSet(
      `${CACHE_KEYS.BRAND_INFO}_certifications`,
      async () => {
        try {
          // TODO: Replace with actual API call when backend is available
          // const response = await fetch(`${this.baseUrl}/certifications`);
          // const result: ApiResponse<Certification[]> = await response.json();
          
          // Use local data for now
          return brandData.certifications.map(cert => ({
            ...cert,
            issueDate: new Date(cert.issueDate),
            expiryDate: (cert as any).expiryDate ? new Date((cert as any).expiryDate) : undefined
          })) as Certification[];
        } catch (error) {
          throw new Error(`Failed to fetch certifications: ${error}`);
        }
      },
      CACHE_CONFIGS.MEDIUM // Use memory cache to avoid JSON serialization issues with Date objects
    ).then(certifications => {
      // Ensure dates are properly converted after cache retrieval
      return certifications.map(cert => ({
        ...cert,
        issueDate: cert.issueDate instanceof Date ? cert.issueDate : new Date(cert.issueDate),
        expiryDate: cert.expiryDate ? (cert.expiryDate instanceof Date ? cert.expiryDate : new Date(cert.expiryDate)) : undefined
      }));
    });
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