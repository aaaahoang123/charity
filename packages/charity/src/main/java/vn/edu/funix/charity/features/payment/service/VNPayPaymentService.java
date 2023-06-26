package vn.edu.funix.charity.features.payment.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.util.DateTimeUtils;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.PaymentConfiguration;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service("vnPayPaymentService")
public class VNPayPaymentService implements PaymentService {
    private final PaymentConfiguration config;
    private final ApplicationConfiguration appConfig;
    private final HmacUtils hmacUtils;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    public VNPayPaymentService(PaymentConfiguration config, ApplicationConfiguration appConfig) {
        this.config = config;
        this.appConfig = appConfig;
        hmacUtils = new HmacUtils(HmacAlgorithms.HMAC_SHA_512, config.getVnPay().getSecret());
    }
    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) throws Exception {
        String version = config.getVnPay().getVersion();
        String command = "pay";
        String orderType = config.getVnPay().getOrderType();
        long amount = donation.getAmount() * 100;
        String transactionRef = "DNC_" + donation.getId();
        String ip = donation.getRequesterIp();
        String terminalCode = config.getVnPay().getTerminalCode();
        String redirectUrl = appConfig.getUrl() + getRedirectUri(donation);

        Map<String, Object> params = new HashMap<>();
        params.put("vnp_Version", version);
        params.put("vnp_Command", command);
        params.put("vnp_TmnCode", terminalCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", transactionRef);
        params.put("vnp_OrderInfo", "Thanh toan don hang:" + transactionRef);
        params.put("vnp_OrderType", orderType);
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", redirectUrl);
        params.put("vnp_IpAddr", ip);

        String datetimeFormat = "yyyyMMddHHmmss";
        var now = LocalDateTime.now();

        params.put("vnp_CreateDate", DateTimeUtils.formatDateTime(now, datetimeFormat));
        params.put("vnp_ExpireDate", DateTimeUtils.formatDateTime(now.plusMinutes(15), datetimeFormat));

        String queryUrl = buildHashString(params);

        String secureHash = hmacUtils.hmacHex(queryUrl);

        queryUrl += "&vnp_SecureHash=" + secureHash;
        String paymentUrl = config.getVnPay().getEndPoint() + "/paymentv2/vpcpay.html?" + queryUrl;

        return new PaymentInfo(
                paymentUrl,
                PaymentInfo.PaymentInfoOpenType.HREF,
                donation.getTransactionProvider(),
                null,
                null
        );
    }

    private String buildHashString(Map<String, Object> data) {
        var fieldNames = new ArrayList<>(data.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        var itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = (String) data.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        return hashData.toString();
    }

    @Override
    public String confirmPayment(Donation donation, Map<String, Object> meta) {
        String vnp_SecureHash = (String) meta.get("vnp_SecureHash");
        meta.remove("vnp_SecureHashType");
        meta.remove("vnp_SecureHash");

        String signValue = hmacUtils.hmacHex(buildHashString(meta));

        if (!Objects.equals(vnp_SecureHash, signValue)) {
            logger.error("Thông tin hashing không khớp, giao dịch có thể bị hack!");
            return null;
        }

        if (!"00".equals(meta.get("vnp_ResponseCode"))) {
            logger.error("Giao dịch VNPay thất bại với response code: " + meta.get("vnp_ResponseCode"));
            return null;
        }

        return (String) meta.get("vnp_TransactionNo");
    }
}
