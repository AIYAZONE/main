<template>
  <footer>
    <div class="middle-box">
      <div class="footer-content">
        <div class="copyright">
          <p>&copy; {{ year }} AIYAZONE. All Rights Reserved.</p>
        </div>

        <div class="legal">
          <a :href="copyright.siteLink" class="site-link">{{ copyright.title }}</a>
          <span class="sep">/</span>
          <a :href="copyright.link" target="_blank" rel="nofollow">{{
            copyright.info
          }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
  data() {
    return {
      copyright: {
        year: new Date().getFullYear(),
        siteLink: "",
        title: "AIYAZONE",
        link: "https://beian.miit.gov.cn/",
        info: "粤ICP备2022083499号",
      },
    };
  },
  mounted() {
    this.getCurrentSite();
  },
  methods: {
    getCurrentSite: function () {
      this.copyright.siteLink = location.origin + "/";
      if (this.copyright.siteLink.indexOf("aiyazone.cn") > 0) {
        this.copyright.info = "鲁ICP备14028542号-2";
      }
    },
  },
  computed: {
    year: function () {
      const time = new Date();
      return time.getFullYear();
    },
  },
});
</script>

<style lang="less" scoped>
footer {
  position: relative;
  z-index: 200;
  padding: 2rem 0;
  background-color: var(--color-bg-primary);

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(229, 231, 235, 0.3);

    .copyright {
      p {
        font-family: var(--brand-font-primary);
        font-size: 0.85rem;
        color: #999999;
      }
    }

    .legal {
      font-size: 0.85rem;
      color: #999999;

      a {
        color: #999999;
        transition: color 0.3s ease;

        &:hover {
          color: var(--brand-primary);
        }
      }

      .sep {
        margin: 0 0.5rem;
        color: var(--border-color);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
