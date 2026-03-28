const app = getApp();
Page({
  data: { userInfo: null },
  onShow() { this.setData({ userInfo: app.globalData.userInfo }); },
  goLogin() { wx.navigateTo({ url: '/pages/login/login' }); },
  goItinerary() { wx.navigateTo({ url: '/pages/itinerary/itinerary' }); },
  logout() {
    app.logout();
    this.setData({ userInfo: null });
    wx.showToast({ title: '已退出', icon: 'success' });
  },
});
