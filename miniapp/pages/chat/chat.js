// pages/chat/chat.js — AI对话页
const app = getApp();
Page({
  data: {
    messages: [],
    inputValue: '',
    sending: false,
    sessionId: '',
    currentAgent: '',
    currentEmoji: '🦞',
  },

  onLoad(options) {
    const agent = options.agent || '';
    const emoji = options.emoji || '🦞';
    this.setData({ currentAgent: agent, currentEmoji: emoji });

    if (agent) {
      const greetings = {
        xiaocheng: '嗨！我是小橙 🍊 专门帮你搞定旅游需求，说说你想去哪？',
        xiaolan: '你好！我是小蓝 🗺️ 行程规划师，告诉我你的旅行需求吧！',
        xiaojin: '我是小金 💰 需要比价报价吗？把行程发给我！',
        xiaonuan: '你好！我是小暖 🌟 有什么出行相关的问题都可以问我~',
        xiaoxin: '嗨~我是小心 ❤️ 记得你呢！有什么想聊的？',
        xiaolv: '我是小绿 📋 需要看运营数据吗？',
      };
      this.addMessage('assistant', greetings[agent] || '你好！有什么可以帮你的？');
    }
  },

  addMessage(role, content) {
    const messages = [...this.data.messages, {
      id: Date.now(),
      role,
      content,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }];
    this.setData({ messages });
  },

  async sendMessage() {
    const { inputValue, sending, currentAgent } = this.data;
    if (sending || !inputValue.trim()) return;

    this.addMessage('user', inputValue.trim());
    this.setData({ inputValue: '', sending: true });

    try {
      const result = await app.request({
        url: '/api/miniapp/chat',
        method: 'POST',
        data: {
          message: inputValue.trim(),
          sessionId: this.data.sessionId,
          agent: currentAgent,
        },
      });

      if (result.sessionId && !this.data.sessionId) {
        this.setData({ sessionId: result.sessionId });
      }

      this.addMessage('assistant', result.reply || '暂时无法回复，请稍后再试。');
    } catch (err) {
      this.addMessage('assistant', '网络异常，请检查连接后重试');
    } finally {
      this.setData({ sending: false });
    }
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },
});
