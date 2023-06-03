package vn.edu.funix.charity.config;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vn.edu.fu.storage")
public class StorageConfiguration {
    private String gcsKeyFilePath = "";
    private String gcsBucket = "";
    private String gcsPathPrefix = "";
    private String uri = "";

    @Bean
    public Storage storage() throws IOException {
        if (gcsKeyFilePath.isEmpty()) {
            return StorageOptions.getDefaultInstance().getService();
        }

        InputStream keyStream;
        ClassPathResource cpr = new ClassPathResource(gcsKeyFilePath);
        if (cpr.exists()) {
            keyStream = cpr.getInputStream();
        } else {
            keyStream = Files.newInputStream(Path.of(gcsKeyFilePath));
        }

        Credentials credentials = GoogleCredentials.fromStream(keyStream);

        return StorageOptions.newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();
    }
}
