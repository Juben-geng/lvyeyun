const app = getApp();
Page({
  data: { agents: [] },
  onLoad() { this.loadAgents(); },
  onShow() { this.loadAgents(); },
  async loadAgents() {
    try {
      const res = await app.request({ url: '/api/miniapp/agents' });
      this.setData({ agents: res.agents || [] });
    } catch (err) { console.error(err); }
  },
  goChat(e) {
    const { key, emoji } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/chat/chat?agent=${key}&emoji=${encodeURIComponent(emoji)}` });
  },
});
