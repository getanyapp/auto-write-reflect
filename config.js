// AI API 配置信息
const AI_CONFIG = {
    // 基础接口地址
    BASE_URL: 'xxx',
    // 完整聊天接口地址
    CHAT_URL: 'xxx',
    // 模型名称
    MODEL: 'gpt-4o-mini',
    // 温度 (控制生成的随机性，0.7 为平衡)
    TEMPERATURE: 0.7,
    // 系统提示词 (默认为空，从用户的浏览器缓存中获取)
    SYSTEM_PROMPT: '',
    // API Key
    API_KEY: 'xxx'
};

// 如果在 Node.js 环境中（例如测试），尝试导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
}

