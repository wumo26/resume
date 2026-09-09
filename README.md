# 吳柏勳個人履歷網站

繁體中文單頁履歷網站，包含個人介紹、照片、學歷與經歷、技能證照、聯絡方式及原始 Word 履歷下載。依照提供的履歷編寫，沒有另行新增未提供的專案、技術或工作成果。

## 直接開啟展示

用瀏覽器開啟 `src/main/resources/static/index.html` 即可。網頁的樣式、程式、照片和下載檔均在專案內，不需要外部 CDN 或前端套件安裝。行動裝置選單、信箱複製與列印樣式已包含；若瀏覽器不允許剪貼簿存取，會選取信箱並顯示手動複製提示。

## 使用 Java 啟動

需安裝 JDK 21，並讓 `java` 指令可執行。

```powershell
.\gradlew.bat bootRun
```

啟動後開啟 http://localhost:8080 。也可以在 Windows 執行 `start.bat`。首次執行 Gradle 會下載所需依賴；後續通常使用快取。其他作業系統可執行 `./gradlew bootRun`。

若 8080 已被其他程式使用：

```powershell
$env:PORT = '8081'
.\gradlew.bat bootRun
```

## 建置與驗證

```powershell
.\gradlew.bat test bootJar exportSite
```

- Java 執行檔：`build/libs/resume-1.0.0.jar`，使用 `java -jar build/libs/resume-1.0.0.jar` 啟動。
- 靜態部署檔：`dist/`，可交給支援靜態檔案的網站服務。
- 整合測試會啟動伺服器，驗證首頁、樣式、程式、照片、圖示與履歷下載均可正常取得。

## 檔案說明

| 檔案 | 用途 |
| --- | --- |
| `src/main/resources/static/index.html` | 首頁與履歷內容 |
| `src/main/resources/static/styles.css` | 桌面、手機、列印版面 |
| `src/main/resources/static/script.js` | 手機選單、區塊導覽、信箱複製 |
| `src/main/resources/static/assets/portrait.jpg` | 從原始履歷取出的照片 |
| `src/main/resources/static/assets/resume.docx` | 可下載的原始履歷 |
| `src/main/resources/static/favicon.svg` | 瀏覽器分頁圖示 |
| `src/main/java/com/example/resume/ResumeApplication.java` | Spring Boot 入口 |
| `src/main/resources/application.properties` | 連接埠與 UTF-8 設定 |
| `build.gradle`、`settings.gradle`、`gradlew*`、`gradle/wrapper/` | Java 建置與啟動工具 |
| `.openai/hosting.json` | 此網站的 Sites 部署設定 |

修改個人資料時，請同步更新首頁與可下載的履歷。網站使用本人照片及聯絡資訊，對外開放時請確認內容符合你的展示需求。
