import { defineStore } from "pinia";
import { ref, readonly, computed } from "vue";
import type { SWOTData, RoadmapData, LearningPath } from "../types/career";
import type { LoadingState } from "../types/common";

export const useCareerStore = defineStore("career", () => {
  // State
  const swotAnalysis = ref<SWOTData | null>(null);
  const roadmapData = ref<RoadmapData | null>(null);
  const learningPath = ref<LearningPath | null>(null);
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined,
  });

  // Actions
  const setSWOTAnalysis = (analysis: SWOTData) => {
    swotAnalysis.value = analysis;
  };

  const setRoadmapData = (roadmap: RoadmapData) => {
    roadmapData.value = roadmap;
  };

  const setLearningPath = (path: LearningPath) => {
    learningPath.value = path;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value = {
      isLoading: loading,
      error,
    };
  };

  const loadCareerData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls when careerService is implemented
      const mockSWOTData: SWOTData = {
        id: "1",
        lastUpdated: new Date(),
        strengths: [
          {
            id: "1",
            title: "10年前端开发经验",
            description: "深厚的前端技术积累和项目实战经验",
            impact: "high",
            category: "technical",
          },
          {
            id: "2",
            title: "PMP/ACP双认证",
            description: "项目管理和敏捷开发的专业认证",
            impact: "high",
            category: "management",
          },
        ],
        weaknesses: [
          {
            id: "1",
            title: "架构经验相对不足",
            description: "需要更多大型系统架构设计经验",
            impact: "medium",
            category: "technical",
          },
        ],
        opportunities: [
          {
            id: "1",
            title: "前端架构师需求增长",
            description: "市场对高级前端架构师需求旺盛",
            impact: "high",
            category: "market",
          },
        ],
        threats: [
          {
            id: "1",
            title: "技术更新迭代快",
            description: "前端技术栈更新频繁，需要持续学习",
            impact: "medium",
            category: "technical",
          },
        ],
        analysis: {
          keyInsights: [
            "技术深度与管理广度结合是核心优势",
            "需要加强架构设计能力",
            "市场机会与个人能力匹配度高",
          ],
          strategicRecommendations: [
            "重点发展前端架构设计能力",
            "深化性能优化专业技能",
            "建立工程化体系经验",
          ],
          actionItems: [
            {
              id: "1",
              title: "完成前端架构学习路径",
              description: "系统学习前端架构设计理论和实践",
              priority: "high",
              deadline: new Date("2025-06-30"),
              status: "pending",
            },
          ],
        },
      };

      const mockRoadmapData: RoadmapData = {
        id: "1",
        title: "前端架构师职业发展路线图",
        description: "24个月分阶段学习+实战路线，目标成为深圳市场40-60K档位的前端架构师",
        phases: [
          {
            id: "1",
            name: "阶段一：工程化基石与性能深耕",
            duration: "第 1-6 个月",
            objectives: [
              "建立标准化的企业级前端工程体系",
              "掌握极致的性能优化方法论与实践",
              "精通 SEO 策略，提升应用的可发现性",
            ],
            keyMilestones: [
              {
                id: "1-3",
                title: "SEO 专项突破",
                description: "实施 SSG/SSR 改造，优化元数据管理与结构化数据。",
                targetDate: new Date("2026-04-30"),
                completed: false,
              },
              {
                id: "1-2",
                title: "性能极致优化",
                description:
                  "建立性能监控看板，优化 LCP/FID/CLS 指标，实施代码分割与预加载策略。",
                targetDate: new Date("2026-05-31"),
                completed: false,
              },
              {
                id: "1-1",
                title: "工程化体系搭建",
                description:
                  "引入 Husky + Commitlint + Lint-staged，配置 Vitest 单元测试覆盖率 > 80%，搭建 GitHub Actions CI/CD。",
                targetDate: new Date("2026-06-30"),
                completed: false,
              },
            ],
            learningGoals: [
              {
                id: "1-1",
                category: "engineering",
                title: "前端工程化体系",
                description: "深入掌握构建工具链与自动化测试",
                resources: [
                  {
                    id: "r-1",
                    title: "Vite 官方文档",
                    type: "documentation",
                    url: "https://vitejs.dev/",
                    estimatedTime: "10h",
                    priority: "high",
                  },
                ],
                practicalProjects: [],
                successCriteria: ["完成项目 CI/CD 流水线搭建", "单元测试覆盖率达标"],
              },
              {
                id: "1-2",
                category: "performance",
                title: "Web 性能优化",
                description: "精通 Web Vitals 指标与优化手段",
                resources: [],
                practicalProjects: [],
                successCriteria: ["Lighthouse 评分 > 90", "首屏加载时间 < 1.5s"],
              },
            ],
            deliverables: [
              {
                id: "1-1",
                title: "前端工程化规范文档",
                description: "包含 Git 规范、代码风格、测试规范的团队手册",
                type: "document",
                dueDate: new Date("2025-03-31"),
                status: "pending",
              },
            ],
          },
          {
            id: "2",
            name: "阶段二：架构模式与系统扩展性",
            duration: "第 7-12 个月",
            objectives: [
              "驾驭复杂系统架构设计",
              "构建高复用、高可维护的基础设施",
              "探索微前端等现代架构模式",
            ],
            keyMilestones: [
              {
                id: "2-3",
                title: "微前端 POC",
                description: "基于 Module Federation 搭建微前端验证项目。",
                targetDate: new Date("2026-09-30"),
                completed: false,
              },
              {
                id: "2-2",
                title: "企业级组件库建设",
                description: "发布标准化 Vue 3 组件库 npm 包。",
                targetDate: new Date("2026-10-31"),
                completed: false,
              },
              {
                id: "2-1",
                title: "Monorepo 架构迁移",
                description: "使用 Turborepo/Nx 重构项目，统一依赖管理。",
                targetDate: new Date("2026-12-31"),
                completed: false,
              },
            ],
            learningGoals: [
              {
                id: "2-1",
                category: "architecture",
                title: "现代前端架构",
                description: "掌握 Monorepo 与 Micro-frontends 架构设计",
                resources: [],
                practicalProjects: [],
                successCriteria: ["成功迁移 Monorepo", "发布私有组件库"],
              },
            ],
            deliverables: [],
          },
          {
            id: "3",
            name: "阶段三：技术领导力与全栈视野",
            duration: "第 13-24 个月",
            objectives: [
              "具备跨端、跨栈的技术视野",
              "制定团队技术战略",
              "成为团队技术决策者",
            ],
            keyMilestones: [
              {
                id: "3-2",
                title: "技术雷达建立",
                description: "建立团队 Tech Radar，规划技术栈演进方向。",
                targetDate: new Date("2027-03-31"),
                completed: false,
              },
              {
                id: "3-1",
                title: "BFF 层设计落地",
                description: "使用 Node.js (NestJS) 搭建 BFF 层，聚合微服务接口。",
                targetDate: new Date("2027-06-30"),
                completed: false,
              },
            ],
            learningGoals: [
              {
                id: "3-1",
                category: "architecture",
                title: "全栈与跨端架构",
                description: "Node.js 服务端开发与跨端技术探索",
                resources: [],
                practicalProjects: [],
                successCriteria: ["BFF 服务上线", "技术白皮书发布"],
              },
            ],
            deliverables: [],
          },
        ],
        currentPhase: 0,
        targetRole: "前端架构师",
        targetSalaryRange: "40-60K",
      };

      const mockLearningPath: LearningPath = {
        id: "1",
        title: "前端架构师学习路径",
        description: "前端架构、性能、工程化三线并行的系统学习路径",
        phases: [
          {
            id: "1",
            name: "基础建设阶段 (0-6个月)",
            duration: "6个月",
            focus: "architecture",
            goals: [
              {
                id: "1",
                category: "architecture",
                title: "前端架构设计基础",
                description: "学习前端架构设计的基本原理、模式和最佳实践",
                resources: [],
                practicalProjects: [
                  {
                    id: "1",
                    name: "个人品牌网站架构重构",
                    description: "重新设计当前个人网站的架构",
                    estimatedTime: "80小时",
                    difficulty: "intermediate",
                    outputs: ["架构设计文档", "重构后的代码", "性能对比报告"],
                  },
                ],
                successCriteria: [
                  "能够独立设计中型项目的前端架构",
                  "掌握微前端、模块联邦等现代架构模式",
                  "具备架构决策的理论依据",
                ],
              },
            ],
            projects: [
              {
                id: "1",
                name: "个人品牌网站架构重构",
                description: "重新设计当前个人网站的架构",
                estimatedTime: "80小时",
                difficulty: "intermediate",
                outputs: ["架构设计文档", "重构后的代码", "性能对比报告"],
              },
            ],
          },
        ],
        totalDuration: "24个月",
      };

      setSWOTAnalysis(mockSWOTData);
      setRoadmapData(mockRoadmapData);
      setLearningPath(mockLearningPath);
      setLoading(false);
    } catch (error) {
      setLoading(
        false,
        error instanceof Error ? error.message : "Failed to load career data"
      );
    }
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  const isLoading = computed(() => loadingState.value.isLoading);
  const error = computed(() => loadingState.value.error);

  return {
    // State (readonly)
    swotAnalysis: readonly(swotAnalysis),
    roadmapData: readonly(roadmapData),
    learningPath: readonly(learningPath),
    isLoading,
    error,

    // Actions
    setSWOTAnalysis,
    setRoadmapData,
    setLearningPath,
    loadCareerData,
    clearError,
  };
});
