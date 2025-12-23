<template>
  <div class="history-list">
    <div class="header">
      <div class="title">近7日历史归档</div>
      <n-button secondary strong @click="router.push('/')" class="back-btn">
        返回首页
      </n-button>
    </div>

    <div class="sitemap-container">
      <div v-if="loading" class="loading">
        <n-spin size="large" />
      </div>
      <n-grid
        v-else-if="dates.length > 0"
        cols="1 560:2 800:3 1100:4 1500:5"
        :x-gap="24"
        :y-gap="24"
      >
        <n-grid-item
          class="history-card"
          v-for="(date, index) in dates"
          :key="date"
          :style="{ animationDelay: index / 10 + 0.1 + 's' }"
        >
          <a :href="getStaticUrl(date)" target="_blank" class="card-link">
            <n-card hoverable class="card-content">
                <div class="card-body">
                    <n-icon size="40" color="var(--n-primary-color)">
                        <Calendar />
                    </n-icon>
                    <span class="date-text">{{ date }}</span>
                </div>
            </n-card>
          </a>
        </n-grid-item>
      </n-grid>
      <div v-else class="empty-state">
        <n-empty description="暂无历史数据" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getHistoryList } from "@/api";
import { NSpin, NEmpty, NButton, NGrid, NGridItem, NCard, NIcon } from "naive-ui";
import { Calendar } from "@icon-park/vue-next";

const router = useRouter();
const dates = ref([]);
const loading = ref(true);

const getStaticUrl = (dateStr) => {
  // Get API base URL and strip 'api/' suffix to get static root
  let baseUrl = import.meta.env.VITE_GLOBAL_API;
  if (baseUrl.endsWith('api/')) {
    baseUrl = baseUrl.slice(0, -4);
  } else if (baseUrl.endsWith('api')) {
    baseUrl = baseUrl.slice(0, -3);
  }
  // Ensure trailing slash
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  return `${baseUrl}history/${dateStr}.html`;
};

onMounted(async () => {
    try {
        const res = await getHistoryList();
        if (res.code === 200) {
            // Only keep the latest 7 days
            dates.value = res.data.slice(0, 7);
        }
    } catch (error) {
        console.error("Failed to fetch history list", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
.history-list {
  padding: 20px 5vw;
  max-width: 1800px;
  margin: 0 auto;
  min-height: calc(100vh - 240px);

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

  .sitemap-container {
    
    .loading, .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
    }

    .history-card {
        opacity: 0;
        transform: translateY(20px);
        animation: cardShow 0.3s forwards ease-in-out;
        
        .card-link {
            text-decoration: none;
            
            .card-content {
                cursor: pointer;
                transition: transform 0.3s;
                
                &:hover {
                    transform: translateY(-5px);
                }
                
                .card-body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    
                    .date-text {
                        margin-top: 10px;
                        font-size: 18px;
                        font-weight: bold;
                        color: var(--n-text-color);
                    }
                }
            }
        }
    }
  }
}

@keyframes cardShow {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
