# RCM Public Portal

公共门户前端工程，基于 Vue 3 + Element Plus + vue-i18n + vue-router。页面布局参考 `https://ht.iq/`，使用极简政务风格，支持中文、英文、阿拉伯语（RTL）与库尔德语索拉尼（RTL）。

## 本地运行

```bash
npm install
npm run dev
```

- 门户：http://localhost:3100/#/portal
- 登录：http://localhost:3100/#/login
- 内容维护台（需登录）：http://localhost:3100/#/admin
- 生产构建：`npm run build`
- 词条自检：`npm run check:i18n`（校验四语词条一致、模板引用的词条都存在）

首次打开会自动创建一个演示管理员，登录后请在「用户管理」中修改密码：

| 账号 | 密码 | 角色 |
| --- | --- | --- |
| `admin` | `Admin@123` | 管理员 |

## 账号与权限

- 账号保存在浏览器 localStorage（`rcm_portal_users_v1`），记录结构仍是 PocketBase 的 `{ key, value }`。
- 口令不落明文：PBKDF2-HMAC-SHA256、16 字节随机盐、12 万次迭代。安全上下文（localhost / https）走 WebCrypto，局域网 http 等非安全上下文回退到等价的纯 JS 实现，两条路径摘要逐字节一致。
- 会话保存在 `rcm_portal_session_v1`，有效期 12 小时；过期、账号被删除或被停用都会自动失效。
- 角色：管理员（内容 + 用户）、内容编辑（仅内容）。保护规则：不能删除 / 停用 / 降级当前登录账号，且必须保留至少一个启用的管理员。
- `/admin` 由路由守卫拦截，未登录跳转 `/#/login?redirect=/admin`；门户 `/portal` 保持公开。

> 边界说明：这是可离线运行的演示级账号体系，只能拦截前台误入，不能替代服务端鉴权。生产环境请把账号迁移到 PocketBase `users` 集合（或服务端会话），前端不应持有口令哈希。

## 页面布局（拖拽）

- 后台「页面布局」列出 7 个门户区块：`home` / `about` / `news` / `videos` / `guide` / `faq` / `apps`。
- 拖动手柄调整顺序（另有上移 / 下移按钮，兼容触屏与键盘），右侧开关控制显隐；保存后写入 `rcm_portal_layout_v1`。
- 门户按该记录动态渲染区块，顶部导航同样跟随顺序，并自动隐藏被关闭的区块；记录缺失或数据异常时回退到默认顺序（`src/utils/layout.js`）。

## 动态内容与国际化

- 静态界面词条位于 `src/locales/{zh,en,ar,ckb}.js`。
- 动态业务数据位于 `src/mock/portalContent.js`，每条内容是一个 PocketBase 兼容记录：
  `key` 为语言无关键（前缀 `rcm_portal_`），`value` 中的文本字段为 `{ zh, en, ar, ckb }` 四语对象。
- 取值统一通过 `src/utils/localized.js`，当前语言缺失时按 `zh → en → ar → ckb` 回退。
- 内容维护台编辑后写入共享响应式仓；同页面与同源标签页实时更新，门户预览自动刷新。

## 数据存储现状

2026-11 核对结果：

- `https://pb.51xyu.com/` 可访问，`/api/health` 正常，`app_data` 集合共有 **67** 条记录，其中 **21** 条属于本门户（`rcm_portal_*`）。
- 页面布局记录 `rcm_portal_layout_v1` 还没有写进 PocketBase：开启同步后首次保存会自动创建，或执行 `npm run seed:pocketbase` 一并写入。
- 但仓库里没有 `.env`，`VITE_POCKETBASE_SYNC` 未开启，因此页面实际读写的是浏览器 localStorage（`rcm_portal_content_v1`），**不会**写回 `pb.51xyu.com`。
- 要让后台改动落到 PocketBase：复制 `.env.example` 为 `.env`，把 `VITE_POCKETBASE_SYNC` 改为 `true`。
- 注意：实测 `app_data` 的 API 规则对匿名开放了查询、创建与删除（匿名 POST 返回 200、DELETE 返回 204），等于任何人都能改门户内容。上生产前必须收紧规则（公开只读、写入需认证）。

## PocketBase 接入

默认 `VITE_POCKETBASE_SYNC=false`，使用内置 mock 数据与浏览器本地缓存。复制 `.env.example` 为 `.env` 并开启同步后，前端会读写已有 PocketBase：

```env
VITE_POCKETBASE_SYNC=true
VITE_POCKETBASE_URL=https://pb.51xyu.com
VITE_POCKETBASE_COLLECTION=app_data
```

集合沿用 RCM 项目的 `app_data`（`key` 唯一文本，`value` JSON）。如需重新写入初始四语内容与页面布局记录：

```bash
npm run seed:pocketbase
```

如 PocketBase API 规则要求认证，可额外设置 `VITE_POCKETBASE_TOKEN`。

## 目录约定

```
src/
  components/admin/    后台用户管理、区块排序
  components/common/   通用组件（语言切换等）
  components/portal/   门户区块组件
  views/               门户、登录与内容维护台页面
  locales/             四语词条与 i18n 配置
  mock/                四语动态业务数据与布局种子
  services/            PocketBase / 本地缓存 / 账号与口令哈希
  stores/              共享内容仓与账号会话
  utils/               本地化取值与页面布局归一化
  styles/              极简主题变量与 RTL 基础样式
```
