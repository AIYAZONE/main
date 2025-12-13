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
          <a :href="copyright.link" target="_blank" rel="nofollow">{{ copyright.info }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  created() {
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
  padding: 4rem 0 2rem;
  background-color: var(--bg-color);
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
    
    .copyright {
      p {
        font-family: var(--font-sans);
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
    }
    
    .legal {
      font-size: 0.85rem;
      color: var(--text-secondary);
      
      a {
        color: var(--text-secondary);
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--accent-gold);
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
