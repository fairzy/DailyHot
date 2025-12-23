<template>
  <footer>
    <div class="copyright">
      <n-text class="description" v-html="packageJson.description" />
      <n-text
        class="author"
        :depth="3"
        v-html="packageJson.author"
        @click="jumpLink(packageJson.github)"
      />
    </div>
    <n-text
      v-if="icp"
      :depth="3"
      class="icp"
      v-html="icp"
      @click="jumpLink('https://beian.miit.gov.cn/')"
    />
    <n-text
      class="icp"
      :depth="3"
      style="margin-top: 5px"
      @click="router.push('/history')"
    >
      历史归档
    </n-text>
  </footer>
</template>

<script setup>
import packageJson from "@/../package.json";
import { useRouter } from "vue-router";

const router = useRouter();

const icp = ref(import.meta.env.VITE_ICP ? import.meta.env.VITE_ICP : null);

// 链接跳转
const jumpLink = (url) => {
  window.open(url);
};
</script>

<style lang="scss" scoped>
footer {
  height: 100px;
  padding: 0 5vw;
  max-width: 1800px;
  margin: 20px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .copyright {
    margin-bottom: 4px;
    .description {
      &::after {
        content: "@ Copyright By";
        margin: 0 6px;
      }
    }
  }
  .author {
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      color: var(--n-code-text-color);
    }
  }
  .icp {
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      color: var(--n-code-text-color);
    }
  }
}
</style>
