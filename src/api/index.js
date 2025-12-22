import axios from "@/api/request";

/**
 * 获取热榜分类数据
 * @param {string} type 热榜分类名称
 * @param {boolean} isNew 是否拉取最新数据
 * @param {object} params 请求参数
 * @returns
 */
export const getHotLists = (type, isNew, params) => {
  return axios({
    method: "GET",
    url: `/${type}${isNew ? "/new" : "/"}`,
    params,
  });
};

/**
 * 获取历史数据
 * @param {string} date 日期 YYYY-MM-DD
 * @returns
 */
export const getHistory = (date) => {
  return axios({
    method: "GET",
    url: `/history/${date}`,
  });
};

/**
 * 获取历史日期列表
 * @returns
 */
export const getHistoryList = () => {
  return axios({
    method: "GET",
    url: "/history",
  });
};
