# AIYAZONE 项目分析

## 1. 项目概览
**AIYAZONE** 是一个为拥有约 10 年前端经验的技术管理者设计的“个人品牌数字花园”。它是一个展示专业技能、作品集、职业历程和个人品牌故事的综合平台。该项目旨在建立专业 IP，连接志同道合的开发者，并记录持续的成长。

## 2. 技术栈
本项目基于现代前端生态系统构建：

-   **核心框架:** Vue 3
-   **构建工具:** Vite
-   **语言:** TypeScript
-   **状态管理:** Pinia
-   **路由:** Vue Router
-   **UI 组件库:** Element Plus
-   **样式:** Less, CSS (包含响应式设计)
-   **动画:** GSAP (GreenSock Animation Platform)
-   **国际化:** Vue I18n (支持中英双语)
-   **文档:** VitePress (位于 `docs/` 目录)
-   **测试:** Vitest, Vue Test Utils

## 3. 项目结构
仓库采用了类似 Monorepo 的结构，包含主应用和文档站点。

-   **`src/`**: 个人品牌主网站的源代码。
    -   `components/`: 可复用的 Vue 组件 (Brand, Career, Portfolio 等)。
    -   `views/`: 页面组件 (Home, About, Career, Portfolio, Contact)。
    -   `stores/`: Pinia 状态管理模块。
    -   `services/`: 业务逻辑和 API 服务 (BrandService, CareerService 等)。
    -   `router/`: 应用路由配置。
    -   `i18n/` & `locales/`: 国际化配置和翻译文件。
    -   `style/`: 全局样式和品牌主题。
    -   `data/`: 静态数据文件 (JSON)，如技能和作品集条目。
-   **`docs/`**: 基于 VitePress 的文档站点 (可能是“数字花园”部分)。
    -   包含博客文章、知识库 (Frontend, PM) 和其他文档的 Markdown 文件。
-   **`.kiro/specs/`**: 项目需求和设计规范。
-   **`public/`**: 静态资源，如图片和 Logo。

## 4. 核心功能 (基于需求)
-   **个人品牌系统:** 包含价值主张、专业照片和导航的主页。
-   **技能展示:** 交互式展示前端、项目管理和领导力技能。
-   **作品集管理:** 展示项目 (如 ZenParticles, Sun Travel) 和开源贡献。
-   **职业时间线与路线图:** 可视化职业历史和未来发展计划。
-   **证书展示:** 展示 PMP, ACP 等专业证书。
-   **品牌故事:** 叙述职业旅程和理念。
-   **联系系统:** 集成社交媒体和联系表单。
-   **国际化支持:** 支持中英文切换。

## 5. 开发指南

### 前置条件
-   Node.js (确保与项目依赖兼容)
-   npm 或 pnpm

### 脚本 (来自 `package.json`)
-   **启动开发服务器:**
    -   `npm run dev`: 同时运行主应用和文档站点。
    -   `npm run dev:main`: 仅运行主应用。
    -   `npm run docs:dev`: 仅运行文档站点 (端口 5174)。
-   **生产构建:**
    -   `npm run build`: 类型检查，构建主应用，构建文档，并将它们合并到 `dist/`。
-   **测试:**
    -   `npm run test`: 使用 Vitest 运行单元测试。
    -   `npm run test:ui`: 运行带 UI 界面的测试。

## 6. 当前状态
该项目处于活跃开发或维护状态，拥有结构化的需求集合。`.kiro/specs` 中详细的需求说明表明该个人项目应用了严谨的产品管理方法。
