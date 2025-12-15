# AIYAZONE 智性极简品牌设计规范 (AIYAZONE Premium Brand Design System) v2.0

> **核心愿景 (Vision)**: 打造一个融合"技术深度"与"艺术美学"的个人 IP 数字殿堂。网站不应只是信息的罗列，而应是一场关于"智性 (Intellect)"与"品味 (Taste)"的视觉叙事。

---

## 1. 设计哲学：智性奢华 (Intellectual Luxury)

我们需要超越常规的"工程师博客"风格，转向**"艺术画廊"**或**"高端杂志"**的视觉语言。

*   **关键词**: 沉静 (Calm)、秩序 (Order)、通透 (Airy)、精致 (Exquisite)。
*   **设计原则**:
    1.  **超级留白 (Macro Whitespace)**: 敢于浪费空间。屏幕的 40% 应该是空白，用以衬托核心内容。
    2.  **非对称平衡 (Asymmetrical Balance)**: 打破死板的居中对齐，使用错位排版创造动态张力。
    3.  **电影感叙事 (Cinematic Storytelling)**: 页面滚动即是镜头推拉，通过视差滚动 (Parallax) 和元素显隐控制节奏。

---

## 2. 视觉识别系统 (Visual Identity System)

### 2.1 升级色彩体系 (Refined Color Palette)

放弃高饱和度的"科技蓝"，转向更深沉、更具质感的色盘。

#### 核心色盘 (Core Palette)
*   **Canvas (画布)**:
    *   Day: `#FAFAFA` (雪青白 - 比纯白更有质感)
    *   Night: `#0F172A` (深海蓝黑 - 比纯黑更深邃)
    *   *Noise Texture*: 所有背景叠加 3% 透明度的噪点纹理，增加纸张质感。
*   **Primary (主色)**:
    *   **Midnight Royal**: `#1E293B` (用于标题，深沉的蓝灰色)
    *   **Obsidian**: `#000000` (纯黑，仅用于超大标题强调)
*   **Accent (点缀)**:
    *   **Electric Blue**: `#3B82F6` (仅用于交互反馈，如光标点、Focus态)
    *   **Champagne Gold**: `linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #D4AF37 100%)` (金属流光，用于徽章、边框高光)

#### 功能色 (Functional Colors)
*   **Border**: `rgba(0, 0, 0, 0.06)` (极细微的边界)
*   **Glass**: `rgba(255, 255, 255, 0.7)` + `backdrop-filter: blur(20px)`
*   **Shadow**:
    *   *Float*: `0 20px 40px -10px rgba(0, 0, 0, 0.08)`
    *   *Glow*: `0 0 20px rgba(212, 175, 55, 0.3)` (金色光晕)

### 2.2 字体排印 (Typography Hierarchy)

*   **Display Font (大标题)**: `Playfair Display` (Serif)
    *   *设置*: `font-weight: 700`, `letter-spacing: -0.03em`, `line-height: 1.05`
    *   *H1 (Hero)*: `clamp(3.5rem, 5vw + 1rem, 6rem)`
    *   *H2 (Section)*: `3rem`
*   **Body Font (正文)**: `Inter` 或 `Lato` (Sans-serif)
    *   *设置*: `font-weight: 300` (Light), `line-height: 1.8`, `color: #4B5563`
    *   *Size*: `1.05rem` (略大于标准 16px，增加阅读舒适度)
*   **Label/Meta (微标)**: `JetBrains Mono`
    *   *设置*: `text-transform: uppercase`, `letter-spacing: 0.15em`, `font-size: 0.75rem`

---

## 3. UI 组件与布局 (Component & Layout Specs)

### 3.1 栅格系统 (Grid System)
*   **PC端**: 12 列栅格，Gutter `24px`，最大宽度 `1400px` (更宽的视野)。
*   **留白阶梯 (Spacing Scale)**:
    *   `--space-xs`: 0.5rem (8px)
    *   `--space-md`: 2rem (32px)
    *   `--space-xl`: 5rem (80px)
    *   `--space-huge`: 10rem (160px) - *用于板块间距*

### 3.2 导航栏 (The Invisible Navigation)
*   **常态**: 透明背景，Logo 黑色，菜单项隐藏，仅显示 Menu 图标（汉堡菜单）。
*   **滚动态**:
    *   背景: `rgba(255, 255, 255, 0.8)`
    *   模糊: `backdrop-filter: blur(24px)`
    *   边框: 底部 `1px solid rgba(0,0,0,0.03)`
*   **交互**: 菜单项 Hover 时不改变颜色，而是显示一条 2px 高的金色短线 (`width: 12px`) 在下方。

### 3.3 首屏 (Hero Section) - "杂志封面"
*   **构图**: 左侧 7 列文字，右侧 5 列图像（或留白）。
*   **标题**: 多行大标题，左对齐。单词之间可能穿插 *Italic* (斜体) 强调。
*   **装饰**: 标题右上方悬浮一个极小的旋转徽章 (Rotating Badge)，内容为 "Est. 2024" 或 "AIYAZONE"。
*   **背景**: 纯色背景 + 噪点 + 右下角极淡的径向渐变光晕 (`#3B82F6` at 3% opacity)。

### 3.4 作品集 (Portfolio) - "Bento Grid"
*   **容器**: CSS Grid 布局。
*   **卡片类型**:
    1.  **Feature Card (2x2)**: 全图背景 + 底部文字蒙版。
    2.  **Standard Card (1x1)**: 上图下文，极简边框。
    3.  **Info Card (1x1)**: 纯色块背景 (Midnight Blue) + 金色大数字数据。
*   **悬停效果 (Hover)**:
    *   整体上浮 `y: -8px`
    *   阴影扩散
    *   图片比例放大 `scale(1.03)`
    *   鼠标位置出现"磁性"光标跟随。

### 3.5 页脚 (Footer) - "极简宣言"
*   **布局**: 上下结构。
*   **上部**: 巨大的 "AIYAZONE" 衬线体文字横跨屏幕 (font-size: 12vw)，透明度 10%。
*   **下部**: 左右两端对齐。左侧版权，右侧社交链接 (纯文字: Github, Twitter, Email)。

---

## 4. 动效与交互 (Motion & Interaction)

高级感的核心在于**"非线性"**与**"物理感"**。

### 4.1 动画曲线 (Bezier Curves)
*   **Premium Ease**: `cubic-bezier(0.22, 1, 0.36, 1)` - 快速启动，极慢停止（如丝般顺滑）。
*   **Bouncy**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - 用于微小的图标回弹。

### 4.2 滚动体验 (Scroll Experience)
*   **Scroll Reveal**: 元素进入视口时，不要简单的 FadeIn。
    *   文字: `translateY(40px)` -> `0`, `opacity: 0` -> `1`, `duration: 1s`.
    *   图片: 蒙版揭示 (Clip-path inset 0 100% 0 0 -> inset 0 0 0 0)。
*   **Parallax**: 背景光晕移动速度是前景的 50%。

### 4.3 微交互 (Micro-interactions)
*   **链接 Hover**: 颜色渐变至金色，下划线从左向右生长。
*   **图片 Hover**: 鼠标变成圆形的 "VIEW" 提示器。

---

## 5. 实施清单 (Implementation Checklist)

1.  **Global Styles**:
    *   [ ] 引入 `Playfair Display` (Google Fonts).
    *   [ ] 定义 CSS Variables (`colors`, `spacing`, `easing`).
    *   [ ] 添加全局噪点背景图层.

2.  **Layout Refactor**:
    *   [ ] 将 `middle-box` 最大宽度提升至 `1400px`.
    *   [ ] 重构 `BrandHero` 为左右/非对称布局.

3.  **Components**:
    *   [ ] **Navbar**: 实现滚动侦测与玻璃态切换.
    *   [ ] **ProjectCard**: 实现 Bento Grid 样式支持 (props: `size="large" | "medium"`).
    *   [ ] **Footer**: 实现大字号背景装饰.

4.  **Polish**:
    *   [ ] 添加 `lenis` 或类似平滑滚动库.
    *   [ ] 调整所有动画曲线为 `Premium Ease`.
