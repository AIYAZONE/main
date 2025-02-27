<template>
  <header>
    <div class="middle-box">
      <a href="/" class="logo">{{ title }}</a>
      <p class="desc" hidden>{{ desc }}</p>
      <nav>
        <ul>
          <li v-for="item in nav" :key="item.text">
            <a :href="item.href" :target="item.target ? item.target : '_blank'">{{
              item.text
            }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      title: "AIYAZONE",
      desc: "Bruce Wang · 90后 · 前端工程师 · 项目管理探索者",
      nav: [
        {
          href: "/brand",
          text: "个人品牌",
          target: "_self",
        },
        {
          href: "https://fe.aiyazone.com/",
          text: "前端之路",
        },
        {
          href: "https://pm.aiyazone.com/",
          text: "项目管理",
        },
        {
          href: "https://blog.aiyazone.com/brand/about.html",
          text: "关于我",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 15px 0;

  background-color: #000;
  color: #fff;

  a.logo {
    color: #fff;
    font-weight: bold;
    font-size: 1.5rem;
  }
  .desc {
    margin-top: 10px;
    font-size: 14px;
  }
  .middle-box,
  nav ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  nav ul li {
    position: relative;
    margin: 0 15px;
    line-height: 30px;

    &:hover::after {
      position: absolute;
      bottom: 0;
      display: block;
      content: " ";
      width: 100%;
      height: 2px;
      background-color: #007dff;
      transition: 0.3s all ease;
    }

    &:last-child {
      margin-right: 0;
    }
    a {
      color: #fff;
    }
  }
}
@media screen and (max-width: 992px) {
  header {
    a.logo {
      font-size: 16px;
      font-weight: bold;
    }
    nav ul li {
      margin: 0 10px;
      font-size: 14px;
    }
  }
}
@media screen and (max-width: 375px) {
  header nav ul li {
    margin: 0 8px;
    font-size: 13px;
  }
}
</style>
