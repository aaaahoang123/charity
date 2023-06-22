package vn.edu.funix.charity.features.payment;

import com.paypal.base.rest.APIContext;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vn.edu.fu.payment")
public class PaymentConfiguration {
    private TransferConfig transfer;
    private PaypalConfig paypal;

    @Getter
    @Setter
    public static class TransferConfig {
        private String bank;
        private String name;
        private String number;
        private String templateType = "compact2";
    }

    @Getter
    @Setter
    public static class PaypalConfig {
        private String clientId;
        private String clientSecret;
        private String mode;
    }

    @Bean
    public APIContext paypalApiContext() {
        return new APIContext(paypal.clientId, paypal.clientSecret, paypal.mode);
    }
}
