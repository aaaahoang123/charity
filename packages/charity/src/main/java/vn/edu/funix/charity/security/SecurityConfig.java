package vn.edu.funix.charity.security;

import lombok.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import vn.edu.funix.charity.security.annotation.UserIdResolver;
import vn.edu.funix.charity.security.annotation.UsernameResolver;

import java.util.List;

@Configuration
@EnableMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true
)
public class SecurityConfig implements WebMvcConfigurer {
    @Override
    public void addArgumentResolvers(@NonNull List<HandlerMethodArgumentResolver> resolvers) {
        WebMvcConfigurer.super.addArgumentResolvers(resolvers);
        resolvers.add(new UserIdResolver());
        resolvers.add(new UsernameResolver());
    }
}
