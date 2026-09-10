# 吳柏勳個人履歷網站

繁體中文單頁履歷網站，包含個人介紹、照片、學歷與經歷、技能證照、聯絡方式及原始 Word 履歷下載。依照提供的履歷編寫，沒有另行新增未提供的專案、技術或工作成果。

## 使用 Angular 啟動

專案根目錄已包含 Angular 22 工作區及 CLI，相依套件記錄於 `package-lock.json`。使用 Node.js 24.15 以上的 24.x 版本（本機已安裝 24.16）。

在此專案目錄執行：

```powershell
npm start
```

也可使用 `npx ng serve`；若已安裝全域 Angular CLI，原本的 `ng s` 指令也能使用。啟動後開啟 http://localhost:4200 。第一次在其他電腦下載此專案時，先執行 `npm ci`。

```powershell
npm run build
npm test
```

正式版輸出在 `dist/`；測試會確認履歷內容、區塊連結、手機選單、Escape 鍵操作，以及信箱複製成功與受限時的提示。Angular 採用獨立元件及 signals，不需要另外安裝 Zone.js。

前端統一使用 TypeScript 原始碼。文案請修改 `frontend/src/app/app.component.html`，選單、導覽及信箱複製邏輯請修改 `app.component.ts`。Angular 開發伺服器和 Spring Boot 使用同一份前端，不需要同步維護兩份 HTML 或互動程式。

若 4200 已被占用，可執行 `npm start -- --port 4201`，然後開啟 http://localhost:4201 。

## TypeScript 與瀏覽器執行檔

手動維護的前端程式都在 `frontend/src/`，使用 `.ts`。舊的 `src/main/resources/static/script.js` 和重複首頁已移除。瀏覽器執行的 `main-*.js` 等檔案由 Angular 自動編譯產生，請勿直接修改建置產物。

`src/main/resources/static/` 現在只保留共用 CSS、照片、履歷下載和圖示。正式版在 `dist/`，請透過 HTTP 網站服務開啟；開發時直接使用 `ng serve` 或下方的 Spring Boot。

## 使用 Java 啟動同一份前端

需安裝 JDK 21 與 Node.js，並讓 `java`、`npm` 指令可執行。第一次下載此專案時先執行 `npm ci`。

```powershell
.\gradlew.bat bootRun
```

Gradle 會先執行 `npm run build`，將 Angular 產物同步到 Java 的靜態資源目錄，再啟動網站。開啟 http://localhost:8080 。也可以在 Windows 執行 `start.bat`。首次執行 Gradle 會下載所需依賴；後續通常使用快取。其他作業系統可執行 `./gradlew bootRun`。

若 8080 已被其他程式使用：

```powershell
$env:PORT = '8081'
.\gradlew.bat bootRun
```

若 IDE 的環境找不到 npm，可指定其完整路徑：

```powershell
.\gradlew.bat bootRun "-PnpmExecutable=C:\path\to\nodejs\npm.cmd"
```

## 建置與驗證

```powershell
.\gradlew.bat test bootJar exportSite
```

- Java 執行檔：`build/libs/resume-1.0.0.jar`，使用 `java -jar build/libs/resume-1.0.0.jar` 啟動。
- Angular 部署檔：`dist/`；`exportSite` 同時匯出到 `build/static-site/`。
- Java JAR 已包含編譯好的前端；執行 JAR 時只需要 Java，不需要再安裝 Node.js。
- 整合測試會啟動 Java 伺服器，確認首頁引用的 Angular 程式與樣式、照片、圖示及履歷下載均可取得，並確認舊版 `script.js` 不再被提供。

## 檔案說明

| 檔案 | 用途 |
| --- | --- |
| `angular.json`、`package.json`、`package-lock.json` | Angular 工作區與套件版本 |
| `tsconfig*.json` | TypeScript 與 Angular 編譯設定 |
| `frontend/src/index.html`、`frontend/src/main.ts` | Angular 首頁與入口 |
| `frontend/src/app/app.component.html` | Angular 履歷內容 |
| `frontend/src/app/app.component.ts` | Angular 選單、區塊導覽、信箱複製 |
| `frontend/src/app/app.component.spec.ts` | Angular 互動測試 |
| `src/main/resources/static/styles.css` | 桌面、手機、列印版面 |
| `src/main/resources/static/assets/portrait.jpg` | 從原始履歷取出的照片 |
| `src/main/resources/static/assets/resume.docx` | 可下載的原始履歷 |
| `src/main/resources/static/favicon.svg` | 瀏覽器分頁圖示 |
| `src/main/java/com/example/resume/ResumeApplication.java` | Spring Boot 入口 |
| `src/main/resources/application.properties` | 連接埠與 UTF-8 設定 |
| `build.gradle`、`settings.gradle`、`gradlew*`、`gradle/wrapper/` | Java 建置與啟動工具 |
| `.openai/hosting.json` | 此網站的 Sites 部署設定 |

修改個人資料時，請同步更新使用中的首頁與可下載的履歷。網站使用本人照片及聯絡資訊，對外開放時請確認內容符合你的展示需求。
