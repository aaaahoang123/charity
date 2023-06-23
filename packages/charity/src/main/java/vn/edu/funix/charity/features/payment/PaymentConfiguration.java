package vn.edu.funix.charity.features.payment;

import lombok.Data;
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
    private PaypalConfig paypal;
    private Currency currency;
    private MomoConfig momo;

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

    @Data
    public static class Currency {
        private String token;
    }

    @Data
    public static class MomoConfig {
        private String endPoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        private String partnerCode;
        private String accessKey;
        private String secretKey;
    }
}
