package vn.edu.funix.charity.features.storage;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

public interface GcsStorageConfiguration {
    String getGcsKeyFilePath();
    String getGcsBucket();
    String getGcsPathPrefix();
    String getGcsUri();

    default Storage storage() throws IOException {
        if (getGcsKeyFilePath().isEmpty()) {
            return StorageOptions.getDefaultInstance().getService();
        }

        InputStream keyStream;
        ClassPathResource cpr = new ClassPathResource(getGcsKeyFilePath());
        if (cpr.exists()) {
            keyStream = cpr.getInputStream();
        } else {
            keyStream = Files.newInputStream(Path.of(getGcsKeyFilePath()));
        }

        Credentials credentials = GoogleCredentials.fromStream(keyStream);

        return StorageOptions.newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();
    }
}
