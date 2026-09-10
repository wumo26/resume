package com.example.resume;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ResumeApplicationTests {
    @Autowired
    private Environment environment;

    @Test
    void servesAngularPageAndItsCompiledAssets() throws Exception {
        String origin = "http://localhost:" + environment.getProperty("local.server.port");
        try (HttpClient client = HttpClient.newHttpClient()) {
            HttpResponse<String> page = client.send(
                HttpRequest.newBuilder(URI.create(origin + "/")).GET().build(),
                HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            assertThat(page.statusCode()).isEqualTo(200);
            assertThat(page.body()).contains("吳柏勳", "<app-root>").doesNotContain("src=\"script.js\"");

            Set<String> assets = new LinkedHashSet<>();
            Matcher references = Pattern.compile("(?:src|href)=\"([^\"]+\\.(?:js|css))\"").matcher(page.body());
            while (references.find()) {
                String asset = references.group(1);
                assets.add(asset.startsWith("/") ? asset : "/" + asset);
            }
            assertThat(assets.stream().anyMatch(asset -> asset.endsWith(".js"))).isTrue();
            assertThat(assets.stream().anyMatch(asset -> asset.endsWith(".css"))).isTrue();
            assets.addAll(Set.of("/assets/portrait.jpg", "/assets/resume.docx", "/favicon.svg"));

            for (String path : assets) {
                HttpResponse<byte[]> response = client.send(
                    HttpRequest.newBuilder(URI.create(origin + path)).GET().build(),
                    HttpResponse.BodyHandlers.ofByteArray());
                assertThat(response.statusCode()).as(path).isEqualTo(200);
                assertThat(response.body()).as(path).isNotEmpty();
                if (path.endsWith(".js")) {
                    assertThat(response.headers().firstValue("content-type").orElse("")).contains("javascript");
                } else if (path.endsWith(".css")) {
                    assertThat(response.headers().firstValue("content-type").orElse("")).contains("text/css");
                }
            }

            for (String path : new String[]{"/script.js", "/frontend/src/app/app.component.ts"}) {
                HttpResponse<Void> response = client.send(
                    HttpRequest.newBuilder(URI.create(origin + path)).GET().build(),
                    HttpResponse.BodyHandlers.discarding());
                assertThat(response.statusCode()).as("obsolete or source file " + path).isEqualTo(404);
            }
        }
    }
}
