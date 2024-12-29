<template>
  <div class="home">
    <section v-for="project in projects" :key="project.title">
      <div class="middle-box">
        <h2>{{ project.title }}</h2>
        <div class="description">{{ project.description }}</div>
        <ul>
          <li v-for="item in project.list" :key="item.name">
            <a :href="item.href" :target="item.target ? item.target : '_blank'">
              <div class="title">
                <img
                  v-if="item.logo"
                  class="item-logo"
                  :src="'../assets/images/logo' + item.logo"
                />
                <span>{{ item.name }}</span>
              </div>
              <div class="info" v-if="item.info">
                <h3>{{ item.info.title }}</h3>
                <p class="info" v-html="item.info.description"></p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      projects: [
        {
          title: "我的站点",
          description: "聚焦个人IP打造，促进品牌价值形成",
          list: [
            /*{
              name: "菜鸟空间",
              info: {
                title: "我的旧博客站",
                description:
                  "整理各类文章，记录心得体会、心路旅程，记录自己的成长历程。",
              },
              href: "https://blog.aiyazone.cn/",
              logo: "/aiyazone.png",
            },
            {
              name: "AIYA Wiki",
              info: {
                title: "我的Wiki站",
                description: "前端Wiki/重学前端/数据结构/算法学习",
              },
              href: "https://wiki.aiyazone.com/",
              logo: "/aiya.png",
            },*/
            {
              name: "AIYA领域",
              info: {
                title: "我的全新博客站",
                description:
                  "路漫漫其修远兮，吾将上下而求索 <br/>记录自己的灵感、重走前端路、搭建网站、我的项目、项目管理学习、日常总结和品牌建设等等知识。",
              },
              href: "https://blog.aiyazone.com/",
              logo: "/aiya.png",
            },
            {
              name: "AIYA FE SITE",
              info: {
                title: "AIYA前端站",
                description:
                  "前端基础/前端技术栈/前端性能/前端安全/前端算法/前端工程化/大前端/微前端",
              },
              href: "https://fe.aiyazone.com/",
              logo: "/aiya.png",
            },
            {
              name: "AIYA PM SITE",
              info: {
                title: "AIYA项目管理站",
                description: "PM知识体系/PM思维导图/PM实战学习",
              },
              href: "https://pm.aiyazone.com/",
              logo: "/aiya.png",
            },
          ],
        },
        {
          title: "我的项目",
          description: "迈出全栈开发的一小步",
          list: [
            {
              name: "",
              info: {
                title: "Enjoy Your Dream Vacation",
                description:
                  "Travel to the any corner of the world, without going around in circles.",
              },
              href: "https://travel.aiyazone.com/",
              logo: "/suntravel-light.png",
            },
            {
              name: "AIYA DevOps",
              info: {
                title: "感谢RuoYi开源，着手搭建自己的平台",
                description:
                  "一个Java EE企业级快速开发平台，基于经典技术组合（Spring Boot、Spring Security、MyBatis、Jwt、Vue）",
              },
              href: "https://devops.aiyazone.com/",
              logo: "/aiya.png",
            },
          ],
        },
        {
          title: "我的工具",
          description: "感谢开源，站在巨人的肩膀上，面向前方",
          list: [
            {
              name: "AIYA Font Editor",
              info: {
                title: "字体在线编辑工具，感谢百度开源",
                description:
                  "在线编辑、转换、预览字体文件 <br> 支持导入的字体格式有 ttf, woff, woff2, svg font, eot, otf等字体格式，支持ttf, woff, woff2等格式字体导出。",
              },
              href: "https://fonteditor.aiyazone.com/",
              logo: "/aiya.png",
            },
          ],
        },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
section {
  padding: 4rem 0;
  text-align: center;
  &:nth-child(2n) {
    background-color: #ddd;
  }
  &:nth-child(2n + 1) {
    background-color: #f5f5f5;
  }
  h2 {
    margin: 0 -1.25rem 0.75rem;
    padding: 0 1.5rem 1.05rem;
    font-size: 36px;
    font-weight: normal;
  }
  .description {
    margin-bottom: 2rem;
  }
  ul {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 -1.25rem;

    li {
      margin: 0 1.25rem 0.9375rem;
      color: #666;
      min-width: 280px;
      max-width: 95%;
      cursor: pointer;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.44, 0.9, 0.6, 0.94);
      transition-property: transform;
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 1px 10px 0 rgb(0 0 0 / 10%);

      &:hover {
        transform: translateY(-4px);
        -webkit-transform: translateY(-4px);
        -moz-transform: translateY(-4px);
      }

      a {
        display: block;
        padding-bottom: 2rem;
        line-height: 1.25rem;
        .title {
          display: flex;
          display: -webkit-flex;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
          line-height: 2rem;
          justify-content: center;
          height: 160px;
          align-items: center;
          color: #fff;
          border-radius: 6px 6px 0 0;
          background: #56a1f1;
        }

        .item-logo {
          width: auto;
          height: 32px;
          margin-right: 12px;
        }

        .info {
          margin: 0 1rem;
          font-size: 0.75rem;
          h3 {
            margin-bottom: 0.625rem;
            font-weight: bold;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 992px) {
  section ul li {
    max-width: 280px;
  }
}

@media screen and (max-width: 991px) {
  section {
    padding: 2rem 0;
    h2 {
      margin: 0;
      font-size: 24px;
    }

    ul {
      margin: 0;
      li {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
        max-width: initial;
        a {
          display: block;
          .info {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 375px) {
  section ul li a .info {
    font-size: 0.75rem;
  }
}
</style>
