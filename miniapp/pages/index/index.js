// pages/index/index.js — 首页
const app = getApp();

Page({
  data: {
    userInfo: null,
    agents: [],
    siteName: '智途AI·旅业云',
    features: [
      { icon: '🍊', title: '需求采集', desc: '10分钟完整采集旅游需求', color: '#ff9500' },
      { icon: '🗺️', title: '行程规划', desc: '3分钟生成专业行程方案', color: '#007aff' },
      { icon: '💰', title: '比价报价', desc: '智能对比供应商价格', color: '#34c759' },
      { icon: '🌟', title: '售后管家', desc: '全程贴心出行服务', color: '#ff2d55' },
      { icon: '❤️', title: '情感伴侣', desc: '记住每个重要时刻', color: '#af52de' },
      { icon: '📋', title: '运营官', desc: '数据驱动决策', color: '#5ac8fa' },
    ],
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.setData({ userInfo: app.globalData.userInfo });
  },

  async loadData() {
    try {
      const [agentRes, infoRes] = await Promise.all([
        app.request({ url: '/api/miniapp/agents' }),
        app.request({ url: '/api/miniapp/info' }),
      ]);
      this.setData({
        agents: agentRes.agents || [],
        siteName: infoRes.app?.name || '智途AI·旅业云',
      });
    } catch (err) {
      console.error('加载数据失败', err);
    }
  },

  goChat(e) {
    const { agent } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/chat/chat?agent=${agent}` });
  },

  goAgents() {
    wx.switchTab({ url: '/pages/agents/agents' });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  goItinerary() {
    wx.navigateTo({ url: '/pages/itinerary/itinerary' });
  },
});
