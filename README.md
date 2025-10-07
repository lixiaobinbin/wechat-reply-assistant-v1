# 微信聊天回复助手

一个智能的聊天回复建议工具，帮助您更好地组织语言和回复微信消息。

## 功能特点

- 🤖 智能分析聊天上下文
- 🎨 多种回复风格选择（正式、友好、幽默等）
- 💡 实时生成回复建议
- 🌐 现代化Web界面
- ⚡ 快速响应

## 快速开始

### 1. 环境准备

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入您的通义千问 API Key
```

### 2. 启动后端服务

```bash
# 安装Python依赖
pip install -r requirements.txt

# 启动后端服务
python main.py
```

### 3. 启动前端服务

```bash
# 安装前端依赖
npm install

# 启动前端开发服务器
npm start
```

### 4. 访问应用

打开浏览器访问 `http://localhost:3000`

## 使用方法

1. 在聊天历史区域粘贴您和聊天对象的对话内容
2. 选择您希望的回复风格
3. 点击"生成回复建议"按钮
4. 查看AI生成的回复建议，选择合适的进行回复

## 技术栈

- **后端**: FastAPI + OpenAI API
- **前端**: React + Ant Design
- **AI模型**: qwen3-max

