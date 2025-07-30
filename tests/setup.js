// 测试环境设置
global.fetch = jest.fn();

// 模拟 Cloudflare Workers 环境
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.headers = new Map(Object.entries(init.headers || {}));
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
  
  text() {
    return Promise.resolve(this.body);
  }
};

// 清理所有模拟
afterEach(() => {
  jest.clearAllMocks();
}); 