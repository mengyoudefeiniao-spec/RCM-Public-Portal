# RCM Public Portal

公共门户前端 Mock 工程，基于 Vue 3 + Element Plus + vue-i18n + vue-router。页面布局参考 `https://ht.iq/`，使用极简政务风格，支持中文、英文、阿拉伯语（RTL）与库尔德语索拉尼（RTL）。

## 本地运行

```bash
npm install
npm run dev
```

- 门户：http://localhost:3100/#/portal
- 内容维护台（Mock）：http://localhost:3100/#/admin
- 生产构建：`npm run build`

## 动态内容与国际化

- 静态界面词条位于 `src/locales/{zh,en,ar,ckb}.js`。
- 动态业务数据位于 `src/mock/portalContent.js`，每条内容是一个 PocketBase 兼容记录：
  `key` 为语言无关键（前缀 `rcm_portal_`），`value` 中的文本字段为 `{ zh, en, ar, ckb }` 四语对象。
- 取值统一通过 `src/utils/localized.js`，当前语言缺失时按 `zh → en → ar → ckb` 回退。
- 内容维护台编辑后写入共享响应式仓；同页面与同源标签页实时更新，门户预览自动刷新。

## PocketBase 接入

默认 `VITE_POCKETBASE_SYNC=false`，使用内置 mock 数据与浏览器本地缓存。复制 `.env.example` 为 `.env` 并开启同步后，前端会读写已有 PocketBase：

```env
VITE_POCKETBASE_SYNC=true
VITE_POCKETBASE_URL=https://pb.51xyu.com
VITE_POCKETBASE_COLLECTION=app_data
```

集合沿用 RCM 项目的 `app_data`（`key` 唯一文本，`value` JSON）。如需重新写入初始四语内容：

```bash
npm run seed:pocketbase
```

如 PocketBase API 规则要求认证，可额外设置 `VITE_POCKETBASE_TOKEN`。

## 目录约定

```
src/
  components/common/   通用组件（语言切换等）
  components/portal/   门户区块组件
  views/               门户与内容维护台页面
  locales/             四语词条与 i18n 配置
  mock/                四语动态业务数据
  services/            PocketBase / 本地缓存适配层
  stores/              共享内容仓
  styles/              极简主题变量与 RTL 基础样式
```
