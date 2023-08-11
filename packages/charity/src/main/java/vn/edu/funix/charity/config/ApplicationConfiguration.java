package vn.edu.funix.charity.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vn.edu.fu.app")
public class ApplicationConfiguration {
    private Boolean debug = false;
    private String url;
    private String frontendUrl;
    @Bean
    public Module hibernateModule() {
        return new Hibernate5JakartaModule();
    }

    @Bean
    public TaskExecutor taskExecutor() {
        return new SimpleAsyncTaskExecutor();
    }
}
