# 🎮 Game Website Template

一个现代化的游戏网站模板，支持多种游戏类型展示和游戏管理功能。

## ✨ 特性

- 🎯 响应式设计，支持移动端和桌面端
- 🎨 现代化的UI界面，使用Tailwind CSS
- 🎮 多种游戏类型支持（解谜、动作、竞速等）
- ⭐ 游戏评分和热门推荐系统
- 🔍 游戏搜索和分类筛选
- 📱 移动端友好的界面设计
- ⚡ 快速加载和流畅的用户体验

## 🚀 快速开始

1. 克隆项目到本地
```bash
git clone [repository-url]
cd game-website-template
```

2. 启动本地服务器
```bash
# 使用Python
python3 -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用任何其他静态文件服务器
```

3. 在浏览器中访问 `http://localhost:8000`

## 📁 项目结构

```
game-website-template/
├── PlayArcade/           # 游戏主页面
│   ├── index.html        # 首页
│   ├── game.html         # 游戏详情页
│   ├── category.html     # 分类页面
│   ├── add-game.html     # 添加游戏页面
│   ├── css/
│   │   └── style.css     # 自定义样式
│   └── js/
│       └── script.js     # 主要JavaScript逻辑
├── public/
│   └── games.json        # 游戏数据文件
└── README.md
```

## 🎮 添加新游戏

在 `public/games.json` 文件中添加新游戏：

```json
{
  "id": "your-game-id",
  "title": "游戏名称",
  "description": "游戏简短描述",
  "longDescription": "游戏详细描述",
  "image": "游戏缩略图URL",
  "iframe": "游戏嵌入链接",
  "category": ["游戏分类"],
  "tags": ["标签1", "标签2"],
  "rating": 4.5,
  "plays": 1000,
  "featured": false,
  "releaseDate": "2024-01-01",
  "controls": ["控制说明1", "控制说明2"],
  "screenshots": ["截图URL1", "截图URL2"]
}
```

## 🏷️ 添加新分类

在 `public/games.json` 的 categories 数组中添加：

```json
{
  "id": "category-id",
  "name": "分类名称",
  "icon": "🎮",
  "color": "blue"
}
```

## 🛠️ 自定义

### 修改颜色主题
编辑 `PlayArcade/css/style.css` 文件来自定义颜色和样式。

### 修改布局
- `PlayArcade/index.html` - 首页布局
- `PlayArcade/game.html` - 游戏详情页布局
- `PlayArcade/category.html` - 分类页面布局

### 修改JavaScript逻辑
`PlayArcade/js/script.js` 包含所有主要的游戏加载和交互逻辑。

## 📱 支持的设备

- 🖥️ 桌面端 (1024px+)
- 📱 平板端 (768px - 1023px)
- 📱 手机端 (< 768px)

## 🌟 技术栈

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- JSON数据存储

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

🎮 享受游戏开发的乐趣！ 