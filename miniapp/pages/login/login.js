// pages/login/login.js — 登录页
const app = getApp();
Page({
  data: { loading: false },

  wxLogin() {
    this.setData({ loading: true });
    app.wxLogin()
      .then(() => {
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 800);
      })
      .catch((err) => {
        wx.showToast({ title: err.error || '登录失败', icon: 'none' });
      })
      .finally(() => this.setData({ loading: false }));
  },

  phoneLogin() {
    wx.showToast({ title: '手机登录开发中', icon: 'none' });
  },
});
