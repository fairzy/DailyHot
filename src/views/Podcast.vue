<template>
  <div class="podcast-page">
    <!-- Header Section -->
    <div class="header-section">
      <div class="title">试图维持你与世界的联系</div>
      <div class="subtitle">AI每日热点播客，通勤/开车路上的AI资讯伴侣</div>
    </div>

    <!-- Audio Trial Section -->
    <div class="audio-trial-section">
      <div class="audio-player">
        <div class="play-btn" @click="togglePlay">
          <n-icon size="24" :component="isPlaying ? PauseOne : PlayOne" />
        </div>
        <div class="waveform-container" @click="seek">
          <!-- Background Track (Gray) -->
          <div class="waveform-track">
             <div 
               v-for="(height, index) in waveformBars" 
               :key="index" 
               class="bar"
               :style="{ height: height + '%', left: (index * (100 / 60)) + '%' }"
             ></div>
          </div>
          <!-- Overlay Track (Red) - using clip-path -->
          <div 
            class="waveform-track overlay"
            :style="{ clipPath: `inset(0 ${100 - progress}% 0 0)` }"
          >
             <div 
               v-for="(height, index) in waveformBars" 
               :key="index" 
               class="bar"
               :style="{ height: height + '%', left: (index * (100 / 60)) + '%' }"
             ></div>
          </div>
        </div>
        <audio 
          ref="audioRef" 
          src="/file/demo.m4a"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onEnded"
        ></audio>
      </div>
    </div>

    <!-- Platform Cards (Restored) -->
    <n-grid x-gap="24" y-gap="24" cols="1 s:1 m:2" responsive="screen" class="cards-container">
      <n-grid-item>
        <div class="platform-card xiaoyuzhou" @click="openLink('xiaoyuzhou')">
          <div class="card-content">
            <div class="card-header">
              <img src="/logo/xiaoyuzhou.png" alt="小宇宙" class="platform-logo-img" />
            </div>
            
            <div class="qr-section">
              <div class="qr-box">
                <img src="/logo/xyz_qr.png" alt="Xiaoyuzhou QR" class="qr-img" />
              </div>
              <div class="scan-tip">
                <span>扫码或点击收听</span>
              </div>
            </div>
          </div>
        </div>
      </n-grid-item>
      
      <n-grid-item>
        <div class="platform-card ximalaya" @click="openLink('ximalaya')">
           <div class="card-content">
            <div class="card-header">
              <img src="/logo/ximalaya.png" alt="喜马拉雅" class="platform-logo-img" />
            </div>
            
            <div class="qr-section">
              <div class="qr-box">
                <img src="/logo/ximalaya_qr.png" alt="Ximalaya QR" class="qr-img" />
              </div>
              <div class="scan-tip">
                <span>扫码或点击收听</span>
              </div>
            </div>
          </div>
        </div>
      </n-grid-item>
    </n-grid>

    <!-- Recent Episodes (Restored) -->
    <div class="recent-episodes">
      <div class="section-header">
         <div class="header-content">
            <span class="section-title">近期播客</span>
            <span class="separator">|</span>
            <span class="section-subtitle-small">不再错过每日热门资讯</span>
         </div>
      </div>
      <div class="file-list">
        <div 
          class="file-item" 
          v-for="(item, index) in mockEpisodes" 
          :key="index" 
          @click="openEpisode(item.url)"
        >
          <div class="file-icon">
            <n-icon size="24" :component="PlayOne" />
          </div>
          <div class="file-info">
             <div class="file-meta">
               <span class="file-date-tag">{{ item.date }}</span>
             </div>
             <div class="file-name">{{ item.title }}</div>
          </div>
          <div class="file-duration">{{ formatDuration(item.duration) }}</div>
        </div>
      </div>
      
      <div class="view-more-container">
        <div class="view-more-btn">查看全部</div>
      </div>
    </div>

    <!-- Features Section (Commute Focused) -->
    <section class="features-section">
      <h2 class="section-title">您的通勤超能力</h2>
      <p class="section-subtitle">专为驾驶与通勤设计，解放双眼，用耳朵掌控世界。</p>
      
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon"><n-icon :component="Time" /></div>
          <h3>重拾碎片时间</h3>
          <p>将拥堵的早晚高峰转化为高效的学习时间，让通勤不再枯燥。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><n-icon :component="VolumeMute" /></div>
          <h3>纯净听觉体验</h3>
          <p>AI 智能降噪与去广，提供广播级音质，没有任何噪音干扰。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><n-icon :component="SteeringWheel" /></div>
          <h3>安全驾驶模式</h3>
          <p>专为驾驶场景优化，全程语音操控，无需分心看屏，守护行车安全。</p>
        </div>
        <div class="feature-item">
           <div class="feature-icon"><n-icon :component="Box" /></div>
          <h3>一站式听热点</h3>
          <p>聚合全网核心资讯，无需切换 App，一段音频听懂今日世界。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><n-icon :component="MagicWand" /></div>
          <h3>精简核心摘要</h3>
          <p>将复杂的长篇新闻转化为 3 分钟精炼简报，直击重点，拒绝废话。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><n-icon :component="SunOne" /></div>
          <h3>开启高效早晨</h3>
          <p>在抵达办公室前已掌握天下大事，从容开启一天的工作。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  TwoDimensionalCode, PlayOne, PauseOne, Weibo, Twitter, Rss,
  Time, VolumeMute, SteeringWheel, Box, MagicWand, SunOne
} from "@icon-park/vue-next";
import { NIcon, NGrid, NGridItem, NAvatar, NTag } from "naive-ui";
import { ref, onMounted } from 'vue';

// Audio Player Logic
const audioRef = ref(null);
const isPlaying = ref(false);
const progress = ref(0);
const duration = ref(0);
const currentTime = ref(0);
const waveformBars = ref([]);

// Generate random waveform bars
onMounted(() => {
  waveformBars.value = Array.from({ length: 60 }, () => Math.floor(Math.random() * 60) + 20);
});

const togglePlay = () => {
  if (!audioRef.value) return;
  
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const onTimeUpdate = () => {
  if (!audioRef.value) return;
  currentTime.value = audioRef.value.currentTime;
  progress.value = (audioRef.value.currentTime / audioRef.value.duration) * 100;
};

const onLoadedMetadata = () => {
  if (!audioRef.value) return;
  duration.value = audioRef.value.duration;
};

const onEnded = () => {
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = 0;
};

const seek = (event) => {
  if (!audioRef.value) return;
  // Calculate click position percentage
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = x / rect.width;
  
  // Set time
  const newTime = percentage * duration.value;
  audioRef.value.currentTime = newTime;
  progress.value = percentage * 100;
};


// Format time mm:ss
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) {
    // Check if it's already a string like "12:45"
    if (typeof seconds === 'string' && seconds.includes(':')) return seconds;
    return "00:00";
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const openLink = (platform) => {
  // Placeholder for future link logic
  if (platform === 'xiaoyuzhou') {
     window.open('https://www.xiaoyuzhoufm.com/podcast/686a9cae0aba9f882432de03?s=eyJ1IjoiNjdmNzQxZDdmMzY5YWFmNzlhY2Y1ZTAyIn0%3D')
  } else {
    window.open('https://m.ximalaya.com/album/110951316?from=pc')
  }
}

const openEpisode = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
}

const mockEpisodes = [
  { 
    vol: '36', 
    date: '12月23日', 
    title: '[12月23日]微博热搜、百度热搜、网易热搜、腾讯热搜、今日头条热搜', 
    duration: 1365,
    url: 'https://www.xiaoyuzhoufm.com/episode/694ab74b0f2ae6a867c85278'
  },
  { 
    vol: '35', 
    date: '12月22日', 
    title: '山西大同灵丘4.2级地震', 
    duration: '08:30', 
    url: 'https://www.xiaoyuzhoufm.com/episode/69494ae10f2ae6a86790586d' 
  },
  { 
    vol: '34', 
    date: '12月21日', 
    title: '男子直播影响游客煽动人肉保安被拘，数九寒天到 冬至时节有这些习俗', 
    duration: '14:20', 
    url: 'https://www.xiaoyuzhoufm.com/episode/6948063b9f70e5d6b382f5bf' 
  },
  { 
    vol: '33', 
    date: '12月20日', 
    title: '各大平台热搜AI播报:2026 央视春晚吉祥物发布，北京同仁堂就南极磷虾油事件致歉', 
    duration: '11:15', 
    url: 'https://www.xiaoyuzhoufm.com/episode/6946a7829f70e5d6b35d9a61' 
  },
  { vol: '32', date: '12月19日', title: '董明珠71岁正是拼的年纪，南京导航软件集体失灵', duration: '10:50', url: 'https://m.ximalaya.com/sound/942082306' },
  { vol: '31', date: '12月18日', title: '各大平台热搜AI播报:2262年两个春节只放1次假，泰国总理回应轰炸柬埔寨赌场', duration: '13:40', url: 'https://m.ximalaya.com/sound/941812912' },
]
</script>

<style lang="scss" scoped>
.podcast-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #111;
  background-color: #fff;
  overflow-x: hidden;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Section */
.header-section {
  margin: 60px 0 40px; /* Reduced bottom margin */
  text-align: center;
  padding: 0 20px;
  
  .title {
    font-size: 48px;
    font-weight: 800;
    background: linear-gradient(120deg, #ea444d 0%, #ea444d 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }
  
  .subtitle {
    font-size: 18px;
    color: #666;
    font-weight: 400;
  }
}

/* Audio Trial Section */
.audio-trial-section {
  max-width: 600px;
  margin: 0 auto 60px;
  padding: 0 20px;

  .audio-player {
    display: flex;
    align-items: center;
    background: #f9f9f9;
    padding: 12px 20px;
    border-radius: 50px;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    border: 1px solid #eee;

    .play-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ea444d;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
      
      &:hover {
        transform: scale(1.05);
        background: #d43b43;
      }
    }

    .waveform-container {
      flex: 1;
      height: 30px;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      
      .waveform-track {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        overflow: hidden;
        
        .bar {
          position: absolute;
          bottom: 50%;
          transform: translateY(50%);
          width: 3px; /* Bar width */
          background: #e0e0e0;
          border-radius: 2px;
          transition: height 0.2s ease;
        }

        &.overlay {
          pointer-events: none; /* Pass clicks to container */
          transition: clip-path 0.1s linear; /* Smooth progress update */
          z-index: 2;
          
          .bar {
            background: #ea444d; /* Active color */
          }
        }
      }
    }
  }
}

/* Cards Container */
.cards-container {
  max-width: 1000px;
  margin: 0 auto 60px;
  padding: 0 20px;
}

.platform-card {
  position: relative;
  background: #fcfcfc;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #eee;
  height: 320px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg, #ea444d, #ea444d);
    opacity: 0; transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12);
    border-color: transparent;
    &::before { opacity: 1; }
    
    .card-content .qr-section .qr-box {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
  }

  .card-content {
    padding: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      height: 60px; /* Fixed height for header area */
      
      .platform-logo-img {
        height: 100%;
        width: auto;
        max-width: 180px; /* Prevent it from being too wide */
        object-fit: contain;
        display: block;
      }
    }
    
    .qr-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .qr-box {
        width: 120px; height: 120px;
        background: #fff;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.4s ease;
        border: 1px solid rgba(0,0,0,0.05);
        overflow: hidden; /* Ensure image stays inside */
        
        .qr-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .scan-tip {
        margin-top: 24px;
        font-size: 14px; color: #ea444d;
        display: flex; align-items: center; gap: 6px;
        .icon { font-size: 16px; }
        b { color: #ea444d; }
      }
    }
    
    .card-footer {
      margin-top: auto;
      display: flex; justify-content: space-between;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
      
      .stat {
        text-align: center;
        .num { font-size: 18px; font-weight: 700; color: #333; }
        .label { font-size: 12px; color: #999; margin-top: 2px; }
      }
    }
  }
}

/* Recent Episodes */
.recent-episodes {
  max-width: 1000px; /* Matched to .cards-container */
  margin: 0 auto 80px;
  padding: 0 20px;
  
  .section-header {
    margin-bottom: 24px; padding-bottom: 12px;
    border-bottom: 2px solid #eee;
    
    .header-content {
      display: flex; 
      align-items: center;
      gap: 12px;
    }

    .section-title { 
      font-size: 24px; 
      font-weight: 700; 
      color: #111; /* Black color */
    }

    .separator {
      font-size: 20px;
      color: #ddd;
      font-weight: 300;
    }
    
    .section-subtitle-small {
      font-size: 24px; /* Match title size */
      color: #ea444d; /* Red color */
      font-weight: 700; 
      letter-spacing: 0.5px;
      margin-top: 0; 
    }
  }

  .file-list {
    margin-bottom: 24px;
    .file-item {
      display: flex; align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #f5f5f5;
      transition: all 0.3s;
      cursor: pointer;
      
      &:hover {
        padding-left: 12px;
        background-color: #f9f9f9;
        .file-icon { color: #ea444d; }
      }

      .file-icon { margin-right: 20px; color: #ccc; transition: color 0.3s; }
      .file-info {
        flex: 1;
        .file-meta {
          font-size: 12px; color: #999; margin-bottom: 4px;
          .file-date-tag { 
            font-size: 15px; 
            font-weight: 700; 
            color: #ea444d; 
            margin-right: 8px;
            font-family: 'Din Alternate', 'Roboto', sans-serif; 
          }
        }
        .file-name { font-size: 16px; font-weight: 600; color: #333; }
      }
      .file-duration { font-size: 14px; color: #999; font-variant-numeric: tabular-nums; }
    }
  }

  .view-more-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    
    .view-more-btn {
      padding: 10px 40px;
      background-color: #f5f5f5;
      color: #666;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #ea444d;
        color: #fff;
      }
    }
  }
}

/* Features Section (Adapted) */
.features-section {
    padding: 80px 20px 100px;
    max-width: 1000px;
    margin: 0 auto;
    border-top: 1px solid #fafafa;
    
    .section-title {
        font-size: 40px;
        font-weight: 800;
        text-align: center;
        margin-bottom: 16px;
        color: #111;
    }
    
    .section-subtitle {
        font-size: 18px;
        color: #666;
        text-align: center;
        margin-bottom: 60px;
    }
    
    .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 40px;
        
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 40px;
        }
        
        .feature-item {
            text-align: center;
            padding: 30px;
            background: #f9f9fb;
            border-radius: 20px;
            transition: transform 0.3s;
            
            &:hover { transform: translateY(-5px); }
            
            .feature-icon {
                font-size: 32px;
                margin-bottom: 20px;
                color: #333;
                background: #fff;
                width: 64px; height: 64px;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                margin-left: auto; margin-right: auto;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            
            h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #222; }
            p { font-size: 14px; color: #666; line-height: 1.6; }
        }
    }
}

/* Footer (Use global styles or scoped) */
.podcast-footer {
    padding: 60px 20px 40px;
    border-top: 1px solid #eaeaea;
    text-align: center;
    background: #fff;
    
    .footer-content {
      max-width: 600px;
      margin: 0 auto;
      display: flex; flex-direction: column; align-items: center;
      
      .footer-logo {
        display: flex; align-items: center; margin-bottom: 16px;
        .logo-img { width: 24px; height: 24px; margin-right: 8px; }
        .logo-text { font-weight: 700; font-size: 18px; }
      }
      
      .footer-slogan {
        font-size: 16px; font-weight: 600; margin-bottom: 12px;
        background: linear-gradient(120deg, #000, #555);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .footer-desc { font-size: 13px; color: #888; margin-bottom: 32px; line-height: 1.6; }
      
      .footer-links {
        display: flex; gap: 32px; margin-bottom: 40px;
        .link-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #666; cursor: pointer;
          &:hover { color: #000; }
        }
      }
      
      .copyright { font-size: 12px; color: #aaa; line-height: 1.8; }
    }
}
</style>
