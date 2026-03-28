// test-api.js — 全量API测试脚本
const http = require('http');
function request(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 3000, path, method: method || 'GET', headers: { 'Content-Type': 'application/json' } };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    const data = body ? JSON.stringify(body) : null;
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = http.request(opts, res => { let s = ''; res.on('data', c => s += c); res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(s) })); });
    req.on('error', reject); if (data) req.write(data); req.end();
  });
}
(async () => {
  let pass = 0, fail = 0;
  const check = (n, ok, d) => { if (ok) { pass++; console.log('  ✅ ' + n); } else { fail++; console.log('  ❌ ' + n + ': ' + d); } };
  console.log('\n🦞 智途AI·旅业云 v2.0 API测试\n');
  const st = await request('/status'); check('GET /status', st.data.status === 'ok', st.data.status); check('version', st.data.version === '2.0.0', st.data.version); check('7 agents', st.data.agents === 7, st.data.agents);
  const ag = await request('/agents'); check('GET /agents', ag.data.agents.length === 7, ag.data.agents?.length);
  console.log('[注册]'); const reg = await request('/api/auth/register', 'POST', { email: `test${Date.now()}@lvyeyun.com`, password: '123456', name: '测试用户' }); check('注册成功', reg.data.token, reg.data.error);
  console.log('[登录]'); const login = await request('/api/auth/login', 'POST', { email: 'test@lvyeyun.com', password: '123456' }); check('登录成功', login.data.token, login.data.error); const tk = login.data.token;
  console.log('[Profile]'); const prof = await request('/api/auth/profile', 'GET', null, tk); check('获取profile', prof.data.user?.name === '测试用户', prof.data.error);
  console.log('[未登录拦截]'); const no = await request('/chat', 'POST', { message: 'hi' }); check('401', no.status === 401, 'status=' + no.status);
  console.log('[AI对话]'); const ch = await request('/chat', 'POST', { message: '帮我规划西安3天行程' }, tk); check('chat', !!ch.data.reply, ch.data.error);
  console.log('[CMS]'); const nav = await request('/api/cms/nav'); check('导航', nav.data.items?.length > 0, nav.data.items?.length); const cfg = await request('/api/cms/config'); check('配置', !!cfg.data.config, cfg.data.config);
  console.log('[小程序]'); const mi = await request('/api/miniapp/info'); check('info', mi.data.app?.name === '智途AI', mi.data.app?.name); check('agents', mi.data.agents?.length === 7, mi.data.agents?.length);
  const mc = await request('/api/miniapp/chat', 'POST', { message: '你好' }, tk); check('小程序对话', !!mc.data.reply, mc.data.error);
  console.log('\n' + '='.repeat(40) + '\n  通过: ' + pass + '  失败: ' + fail + '\n' + '='.repeat(40) + '\n');
  process.exit(fail > 0 ? 1 : 0);
})();
