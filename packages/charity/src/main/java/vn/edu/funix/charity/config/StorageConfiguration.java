package vn.edu.funix.charity.config;

import com.google.cloud.storage.Storage;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.edu.funix.charity.features.storage.GcsStorageConfiguration;

import java.io.IOException;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vn.edu.fu.storage")
public class StorageConfiguration implements GcsStorageConfiguration {
    private String gcsKeyFilePath = "";
    private String gcsBucket = "";
    private String gcsPathPrefix = "";
    private String gcsUri = "";

    @Bean
    @Override
    public Storage storage() throws IOException {
        return GcsStorageConfiguration.super.storage();
    }
}
