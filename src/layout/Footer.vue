<template>
  <footer>
    <div class="copyright">
      <span>© {{ year }} </span>
      <a :href="copyright.siteLink" v-html="copyright.title" class="site-link"></a>
      <a :href="copyright.link" target="_blank" rel="nofollow">{{ copyright.info }}</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      copyright: {
        year: "",
        siteLink: "",
        title: "AIYA领域",
        link: "https://beian.miit.gov.cn/",
        info: "粤ICP备2022083499号",
      },
    };
  },
  created() {
    this.getCurrentSite();
    this.getCurrenYear();
  },
  methods: {
    getCurrentSite: function () {
      this.copyright.siteLink = location.origin + "/";
      if (this.copyright.siteLink.indexOf("aiyazone.cn") > 0) {
        this.copyright.info = "鲁ICP备14028542号-2";
      }
    },
    getCurrenYear: function () {
      const currTime = new Date();
      this.copyright.year = currTime.getFullYear();
    },
  },
  computed: {
    year: function () {
      const time = new Date();
      return time.getFullYear();
    },
  },
};
</script>

<style lang="less" scoped>
footer {
  padding: 0 2.5rem;
  line-height: 40px;
  text-align: center;
  font-size: 0.75rem;
  color: #fff;
  background-color: #000;
  a {
    color: #fff;
    &:hover {
      color: #409eff;
    }
  }
  .site-link {
    margin-left: 2px;
    margin-right: 10px;
  }
}
</style>
