package vn.edu.funix.charity.features.payment.entity;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class CurrencyConversionData {
    private Meta meta;
    private Map<String, ResponseData> data;

    @Data
    public static class Meta {
        private LocalDateTime lastUpdatedAt;
    }

    @Data
    public static class ResponseData {
        private String code;
        private Double value;
    }
}
