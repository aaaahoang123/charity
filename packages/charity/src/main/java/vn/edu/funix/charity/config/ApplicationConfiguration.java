package vn.edu.funix.charity.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vn.edu.fu.app")
public class ApplicationConfiguration {
    private Boolean debug = false;
    @Bean
    public Module hibernateModule() {
        return new Hibernate5JakartaModule();
    }
}
