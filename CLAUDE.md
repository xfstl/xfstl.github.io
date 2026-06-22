# CLAUDE.md

## 项目概览

Ziang 的儿童学习练习站，部署在 GitHub Pages：<https://xfstl.github.io>。

三个科目：
- **口算 (math)**：20 / 100 以内加减法，题目运行时随机生成，带计时
- **阅读 (reading)**：成语故事 + 生活常识短文选择题，题库 `reading.json`（100 篇），不计时
- **日常口语 (english)**：情境英语选择题，题库 `english.json`（200 句），支持 Web Speech 朗读

完全是静态站点，没有任何构建步骤或框架依赖。`index.html` 直接被浏览器打开就能跑。

## 目录结构

```
.
├── index.html          # 全部 UI + CSS + JS（~1800 行单文件应用）
├── reading.json        # 阅读题库（由 scripts/build-reading.js 生成，勿手改）
├── english.json        # 口语题库（由 scripts/build-english.js 生成，勿手改）
├── scripts/
│   ├── build-reading.js   # Node 脚本：组装阅读题库 → reading.json
│   └── build-english.js   # Node 脚本：组装口语题库 → english.json
├── .nojekyll           # 让 GitHub Pages 直接发布静态文件，不跑 Jekyll
└── README.md
```

## 架构要点

### 单文件 SPA
`index.html` 内联了所有样式与脚本。三块屏幕通过 CSS class 切换：
- `#home`：科目选择卡片
- `#subject`：所选科目的设置 + 开始按钮（口算独占难度/模式选项）
- `#quiz`：答题（口算走 numpad；阅读/口语走 choice grid）
- `#result`：成绩、回顾、错题重练、转盘奖励入口

`switchScreen(id)` 控制屏幕切换动画，并把 `body.className` 设为 `quiz-mode` / `result-mode` / `welcome-mode`，背景渐变随之变化。

### 题目来源
- 口算：`generateQuestions()` 实时生成，去重 + 防死循环（`maxAttempts = quizTotal * 100`）
- 阅读 / 口语：`fetch()` 加载 JSON 题库，`pickQuestionsSmart()` 优先抽未做过的题目，本地用 `readingSeenIds` / `englishSeenIds` 记录已练 ID，做完一轮自动清空重置

### 持久化
全部本地化在 `localStorage`，单一 key：`ziang-quiz`。结构：

```js
{
  soundOn, subject, level, mode,                  // 用户偏好
  practiceCount_math / practiceCount_reading...   // 练习次数
  record_math_20_mix / record_reading / ...       // 最高分（含 timeMs）
  readingSeenIds, englishSeenIds,                 // 已练题目 ID
  perfectCountDate, perfectCountToday,            // 当日满分次数
  lastWheelDate, lastWheelPrize, wheelConfirmed,  // 转盘奖励
}
```

`migrateStorage()` 负责把旧字段迁移到新 key，新增字段记得在这里加迁移逻辑。

### 计时
- 口算 / 口语计时，阅读不计时（`usesTimer()` 控制）
- `timerStart` + `pausedMs` + `pauseStart` + `visibilityPauseStart` 实现"反馈期暂停 + 切后台暂停"
- 切 tab 走 `visibilitychange`；反馈弹窗走 `pauseTimer()` / `resumeTimer()`

### 转盘奖励
满分（且非错题重练、非自定义题数）会累计 `perfectCountToday`。每天**第 3 次**满分弹出转盘（`WHEEL_PERFECT_COUNT = 3`），抽完写入 `lastWheelDate`，当天不再触发；奖励需家长确认（`wheelConfirmed`）。

### 版本号
页脚版本号取自 `api.github.com/repos/xfstl/xfstl.github.io/commits/main` 的最新 commit 时间，按上海时区格式化。请求失败时显示 `版本 —`。

## 关键常量（`index.html` 内）

| 常量 | 含义 |
| --- | --- |
| `TOTAL = 10` | 口算 / 口语每组题数 |
| `READING_TOTAL = 5` | 阅读每组篇数 |
| `POINTS = 10` | 每题分值 |
| `STORAGE_KEY = 'ziang-quiz'` | localStorage 主 key |
| `WHEEL_PERFECT_COUNT = 3` | 当日第几次满分触发转盘 |
| `SUBJECTS`, `HINTS`, `WHEEL_PRIZES` | 科目元信息 / 提示语 / 奖励配置 |

## 常用命令

本仓库没有 `package.json`，所以没有 `npm install`。命令都是直接跑：

```bash
# 本地预览（任选其一）
python3 -m http.server 8000          # 然后 http://localhost:8000
open index.html                      # macOS 直接用浏览器打开

# 重新生成题库（修改了 scripts/*.js 才需要跑）
node scripts/build-reading.js        # → reading.json
node scripts/build-english.js        # → english.json

# 部署
git push origin main                 # GitHub Pages 自动发布；版本号会随 commit 时间刷新
```

## 编码约定

1. **单文件原则**：所有 UI 逻辑都在 `index.html` 里。除非有强烈理由，别新增 JS / CSS 文件——会破坏"打开即跑"的简洁。
2. **题库不要手改 JSON**：`reading.json` / `english.json` 由脚本生成。要加题、改答案，都改 `scripts/build-*.js` 里的源数组后重新生成。脚本里有 `validateItem` / 数量断言，跑不过就别提交。
3. **题目 ID 稳定**：`reading.json` 用 `r1, r2, ...`，`english.json` 用 `e1, e2, ...`。一旦发布就别改 ID，否则 `readingSeenIds` / `englishSeenIds` 里的历史记录失效，用户当前的"已读"会被作废。
4. **答案索引轮换**：脚本里 `ANSWER_ROTATION` 把所有 `answer: 0` 散到 0/1/2/3，避免用户靠"全选第一个"作弊。新增题目时让脚本去处理轮换，源数组里写 `answer: 0` 即可。
5. **localStorage 迁移**：增删字段时，更新 `migrateStorage()`，老用户不至于丢数据。
6. **CSS 范围**：所有样式都在 `<style>` 块内，按"全局 → 屏幕 → 组件"顺序写。新增组件优先复用 `.btn`/`.chip`/`.section-label` 等已有类。
7. **音效 / 朗读**：通过 `playTone(type)` 与 `speakEnglish(text)` 统一调用，受 `soundOn` 开关控制；新增交互别直接 `new AudioContext()`，复用 `getAudioContext()`。
8. **数组下标安全**（来自全局规范）：`questions[current]`、`q.options[q.userAnswer]` 等访问前，确认下标在范围内；缓存的 index 用之前重新验证。
9. **中文文案优先**：界面、提示、错误都用中文（zh-CN）；英文只用于口语题的 `heard` / 选项内容。
10. **不要随意删 git 中的文件**：题库 JSON 体积大但请保留（GitHub Pages 直接读取）。

## 测试与验证

没有自动化测试。改动后请人工验证：

- 三个科目分别能进入并完成一组题
- 口算的 20 / 100 难度 + 加 / 减 / 混合模式都能正常出题
- 计时在切 tab、反馈弹窗时正确暂停
- 改了 `scripts/build-*.js` 之后 `node scripts/build-*.js` 能跑通，并且 `git diff reading.json` / `english.json` 看起来合理
- localStorage 改动后清空再进站，迁移逻辑不报错

UI 改动后建议在浏览器跑一遍真实流程，type-check 帮不上忙。

## 部署

推 `main` 分支即上线。`.nojekyll` 保证 GitHub Pages 不跑 Jekyll，直接发布静态文件。无 CI / workflow 配置。
