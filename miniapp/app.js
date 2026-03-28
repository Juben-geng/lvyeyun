// app.js — 智途AI·旅业云 小程序入口
App({
  globalData: {
    userInfo: null,
    token: null,
    apiBase: 'https://你的域名.vercel.app', // 部署后替换为实际地址
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.checkToken(token);
    }
  },

  // 微信登录
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: `${this.globalData.apiBase}/api/auth/wechat-login`,
              method: 'POST',
              data: { code: res.code },
              success: (response) => {
                if (response.data.token) {
                  this.globalData.token = response.data.token;
                  this.globalData.userInfo = response.data.user;
                  wx.setStorageSync('token', response.data.token);
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              },
              fail: reject,
            });
          } else {
            reject(new Error('wx.login 获取 code 失败'));
          }
        },
        fail: reject,
      });
    });
  },

  // 检查Token是否有效
  checkToken(token) {
    wx.request({
      url: `${this.globalData.apiBase}/api/auth/profile`,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.userInfo = res.data.user;
        } else {
          this.logout();
        }
      },
      fail: () => this.logout(),
    });
  },

  // 退出登录
  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
  },

  // 封装请求
  request(options) {
    return new Promise((resolve, reject) => {
      const header = { 'Content-Type': 'application/json', ...options.header };
      if (this.globalData.token) {
        header['Authorization'] = `Bearer ${this.globalData.token}`;
      }
      wx.request({
        url: `${this.globalData.apiBase}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        header,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            this.logout();
            wx.navigateTo({ url: '/pages/login/login' });
            reject(new Error('登录已过期'));
          } else {
            reject(res.data);
          }
        },
        fail: reject,
      });
    });
  },
});
