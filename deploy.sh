#!/bin/bash

# ================= 配置区域 =================
# 服务器 IP
SERVER_IP="43.138.150.181"
# 服务器用户名
SERVER_USER="root"

# 前端项目部署路径 (Nginx root)
# 例如: /www/wwwroot/dailyhot.com
REMOTE_FRONTEND_PATH="/home/lighthouse/project/easynews/web"

# 后端项目部署路径
# 例如: /www/wwwroot/dailyhot-api
REMOTE_BACKEND_PATH="/home/lighthouse/project/easynews/DailyHotApi"

# 后端 PM2 进程名 (需要在服务器上先启动一次: pm2 start index.js --name dailyhot-api)
PM2_APP_NAME="DailyHotApi"
# ===========================================

# 颜色输出
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}===> 开始部署流程 <===${NC}"

# 1. 部署前端
echo -e "${GREEN}===> [1/4] 正在构建前端项目...${NC}"
pnpm build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}===> [2/4] 前端构建成功，正在上传静态文件...${NC}"
    # 使用 rsync 上传 dist 目录内容
    rsync -avz --delete ./dist/ ${SERVER_USER}@${SERVER_IP}:${REMOTE_FRONTEND_PATH}
else
    echo "前端构建失败，终止部署"
    exit 1
fi

# 2. 部署后端
echo -e "${GREEN}===> [3/4] 正在上传后端代码 (已自动排除 .env)...${NC}"
# 假设后端代码在 ../DailyHotApi 目录
# --exclude '.env': 关键！确保不覆盖服务器的环境变量
# --exclude 'node_modules': 不上传依赖，在服务器端安装
# --exclude '.git': 不上传 git 目录
# --exclude 'logs': 不上传日志
rsync -avz \
    --exclude '.env' \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'logs' \
    --exclude 'dist' \
    ../DailyHotApi/ \
    ${SERVER_USER}@${SERVER_IP}:${REMOTE_BACKEND_PATH}

# 3. 重启后端服务
echo -e "${GREEN}===> [4/5] 正在服务器上安装依赖并重启服务...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${REMOTE_BACKEND_PATH} && npm install --production && pm2 reload ${PM2_APP_NAME} || pm2 start index.js --name ${PM2_APP_NAME}"

# 4. 触发一次历史归档生成
echo -e "${GREEN}===> [5/5] 等待服务启动(10s)并生成今日历史归档...${NC}"
sleep 10
# 必须使用完整的环境执行
ssh ${SERVER_USER}@${SERVER_IP} "cd ${REMOTE_BACKEND_PATH} && npm run gen-history"

echo -e "${GREEN}===> 部署完成! <===${NC}"
