package vn.edu.funix.charity.features.payment;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vn.edu.fu.payment")
public class PaymentConfiguration {
    private TransferConfig transfer;

    @Getter
    @Setter
    public static class TransferConfig {
        private String bank;
        private String name;
        private String number;
        private String templateType = "compact2";
    }
}
