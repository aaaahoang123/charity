package vn.edu.funix.charity.features.payment.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;

import java.util.Map;

@Getter
@AllArgsConstructor
public class PaymentInfo {
    private String url;

    @Enumerated(EnumType.STRING)
    private PaymentInfoOpenType openType;

    @Enumerated(EnumType.STRING)
    private TransactionProvider provider;

    private String confirmMessage;

    Map<String, Object> meta;
    public enum PaymentInfoOpenType {
        MODAL, HREF,
    }
}
