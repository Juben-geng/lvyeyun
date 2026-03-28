const app = getApp();
Page({
  data: { itineraries: [] },
  onShow() { this.loadItineraries(); },
  async loadItineraries() {
    try {
      const res = await app.request({ url: '/api/miniapp/itinerary' });
      this.setData({ itineraries: res.itineraries || [] });
    } catch (err) { console.error(err); }
  },
  goChat() { wx.switchTab({ url: '/pages/chat/chat' }); },
});
