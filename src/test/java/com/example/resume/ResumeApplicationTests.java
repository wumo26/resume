package com.example.resume;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

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
    void servesResumeAndAllRequiredAssets() throws Exception {
        String origin = "http://localhost:" + environment.getProperty("local.server.port");
        try (HttpClient client = HttpClient.newHttpClient()) {
            for (String path : new String[]{"/", "/styles.css", "/script.js", "/assets/portrait.jpg", "/assets/resume.docx", "/favicon.svg"}) {
                HttpResponse<byte[]> response = client.send(
                    HttpRequest.newBuilder(URI.create(origin + path)).GET().build(),
                    HttpResponse.BodyHandlers.ofByteArray());
                assertThat(response.statusCode()).as(path).isEqualTo(200);
                assertThat(response.body()).as(path).isNotEmpty();
                if (path.equals("/")) {
                    assertThat(new String(response.body(), java.nio.charset.StandardCharsets.UTF_8))
                        .contains("吳柏勳", "id=\"experience\"", "id=\"contact\"");
                }
            }
        }
    }
}
