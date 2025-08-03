# AI Video Factory

一個現代化的影片生成系統，整合前端介面、後端 API 和 Make.com 自動化工作流程。

## 🌟 功能特色

- **簡潔現代的前端介面**：響應式設計，支援多種裝置
- **強大的後端 API**：Express.js 構建，支援資料驗證和錯誤處理
- **Make.com 整合**：自動化影片生成工作流程
- **一鍵部署**：支援 Vercel 平台部署
- **環境變數管理**：安全的配置管理

## 🚀 快速開始

### 本地開發

1. **安裝依賴項**
   ```bash
   npm install
   ```

2. **設定環境變數**
   ```bash
   cp .env.example .env
   ```
   編輯 `.env` 文件，設定您的 Make.com Webhook URL：
   ```
   MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-url-here
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **開啟瀏覽器**
   訪問 `https://ai-video-generator-server.vercel.app`

### 生產部署

#### 方法一：Vercel 部署（推薦）

1. **準備 GitHub 儲存庫**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/video-generator.git
   git push -u origin main
   ```

2. **連接 Vercel**
   - 登入 [Vercel](https://vercel.com)
   - 點擊 "New Project"
   - 選擇您的 GitHub 儲存庫
   - 配置環境變數：
     - `MAKE_WEBHOOK_URL`: 您的 Make.com Webhook URL
     - `NODE_ENV`: `production`

3. **部署**
   Vercel 會自動部署您的應用程式

#### 方法二：其他平台部署

支援任何 Node.js 託管平台，如 Heroku、Railway、DigitalOcean 等。

## 📁 專案結構

```
video-generator/
├── index.html          # 前端頁面
├── styles.css          # 樣式文件
├── script.js           # 前端 JavaScript
├── server.js           # 後端伺服器
├── package.json        # 依賴項配置
├── vercel.json         # Vercel 部署配置
├── .env.example        # 環境變數範例
├── .gitignore          # Git 忽略文件
└── README.md           # 專案說明
```

## 🔧 API 文件

### POST /generate

生成影片請求端點

**請求體：**
```json
{
  "topic": "影片主題",
  "style": "professional|casual|creative|educational|entertainment",
  "duration": 30|60|120|300,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**回應：**
```json
{
  "success": true,
  "message": "影片生成請求已成功發送",
  "data": {
    "requestId": "req_1234567890",
    "videoData": { ... },
    "makeResponse": "..."
  }
}
```

### GET /health

健康檢查端點

**回應：**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "webhookConfigured": true
}
```

## 🔐 環境變數

| 變數名稱 | 描述 | 必需 | 預設值 |
|---------|------|------|--------|
| `NODE_ENV` | 運行環境 | 否 | `development` |
| `PORT` | 伺服器端口 | 否 | `3000` |
| `MAKE_WEBHOOK_URL` | Make.com Webhook URL | 是 | - |

## 🛠️ 開發工具

在開發模式下，瀏覽器控制台提供以下工具：

- `fillTestData()`: 填充測試數據
- `clearForm()`: 清空表單
- `VideoGenerator`: 主要 API 物件

## 📱 前端功能

- **響應式設計**：支援桌面和行動裝置
- **即時驗證**：表單欄位即時驗證
- **加載狀態**：視覺化加載指示器
- **錯誤處理**：友善的錯誤訊息顯示
- **鍵盤快捷鍵**：Ctrl+Enter 快速提交
- **動畫效果**：流暢的 UI 動畫

## 🔧 後端功能

- **資料驗證**：完整的輸入驗證
- **錯誤處理**：統一的錯誤處理機制
- **CORS 支援**：跨域請求支援
- **日誌記錄**：詳細的請求日誌
- **健康檢查**：系統狀態監控
- **優雅關閉**：安全的伺服器關閉

## 🔗 Make.com 整合

本系統設計為與 Make.com 無縫整合：

1. 前端收集使用者輸入
2. 後端驗證並轉發數據
3. Make.com 接收數據並執行自動化工作流程
4. 系統回應處理結果

## 🐛 故障排除

### 常見問題

**Q: 無法連接到 Make.com Webhook**
- 檢查 `MAKE_WEBHOOK_URL` 環境變數是否正確設定
- 確認 Make.com Webhook 是否啟用
- 檢查網路連接

**Q: 前端無法連接到後端**
- 確認後端伺服器正在運行
- 檢查 API 端點 URL 是否正確
- 查看瀏覽器控制台錯誤訊息

**Q: Vercel 部署失敗**
- 檢查 `vercel.json` 配置
- 確認環境變數已正確設定
- 查看 Vercel 部署日誌

## 📄 授權

MIT License - 詳見 LICENSE 文件

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 支援

如有問題，請建立 Issue 或聯繫開發團隊。

---

**AI Video Factory** - 讓影片創作變得簡單！ 🎬✨