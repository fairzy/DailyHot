<template>
  <div class="history-list">
    <div class="header">
      <div class="title">历史回顾</div>
      <n-button secondary strong @click="router.push('/')" class="back-btn">
        返回首页
      </n-button>
    </div>

    <div v-if="loading" class="loading-state">
      <n-spin size="large" />
      <div class="text">正在加载历史档案...</div>
    </div>

    <div v-else-if="error" class="error-state">
      <n-result status="500" title="获取失败" description="无法获取历史列表，请稍后重试">
        <template #footer>
          <n-button @click="loadList">重试</n-button>
        </template>
      </n-result>
    </div>

    <div v-else-if="dates.length === 0" class="empty-state">
      <n-empty description="暂无历史数据" />
    </div>

    <div v-else class="date-grid">
      <a
        v-for="date in dates"
        :key="date"
        class="date-card"
        :href="`/history/${date}.html`"
        target="_blank"
      >
        <div class="date-content">
          <n-icon size="24" :component="Calendar" />
          <span class="date-text">{{ date }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getHistoryList } from "@/api";
import { Calendar } from "@icon-park/vue-next";

const router = useRouter();
const dates = ref([]);
const loading = ref(true);
const error = ref(false);

const loadList = async () => {
  loading.value = true;
  error.value = false;
  try {
    const res = await getHistoryList();
    if (res.code === 200) {
      dates.value = res.data;
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadList();
});
</script>

<style lang="scss" scoped>
.history-list {
  padding: 20px 0;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .title {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    .text {
      margin-top: 16px;
      color: var(--n-text-color-3);
    }
  }

  .date-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;

    .date-card {
      cursor: pointer;
      text-align: center;
      transition: all 0.3s;
      text-decoration: none;
      color: inherit;
      background-color: var(--n-card-color);
      border-radius: 3px;
      display: block; // Make 'a' tag block
      
      :deep(.n-card) {
          cursor: pointer;
          // Inherit styles from n-card usage previously or wrap n-card inside
      }
      
      .date-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 20px; 
        border: 1px solid var(--n-border-color);
        border-radius: 8px;
        transition: all 0.3s;
        
        &:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .date-text {
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
