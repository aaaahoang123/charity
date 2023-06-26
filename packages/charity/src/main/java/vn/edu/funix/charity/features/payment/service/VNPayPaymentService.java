package vn.edu.funix.charity.features.payment.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
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
@RequiredArgsConstructor
public class VNPayPaymentService implements PaymentService {
    private final PaymentConfiguration config;
    private final ApplicationConfiguration appConfig;
    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) throws Exception {
        String vnp_Version = config.getVnPay().getVersion();
        String vnp_Command = "pay";
        String orderType = config.getVnPay().getOrderType();
        long amount = donation.getAmount();
        String vnp_TxnRef = "DNC_" + donation.getId();
        String vnp_IpAddr = donation.getRequesterIp();
        String vnp_TmnCode = config.getVnPay().getTerminalCode();
        String redirectUrl = appConfig.getUrl() + "/public/vnpay/" + donation.getId();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", redirectUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        DateTimeUtils.formatDateTime(LocalDateTime.now(), "yyyyMMddHHmmss");

        String datetimeFormat = "yyyyMMddHHmmss";
        var now = LocalDateTime.now();

        vnp_Params.put("vnp_CreateDate", DateTimeUtils.formatDateTime(now, datetimeFormat));
        vnp_Params.put("vnp_ExpireDate", DateTimeUtils.formatDateTime(now.plusMinutes(15), datetimeFormat));

        var fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        var itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();

        var utils = new HmacUtils(HmacAlgorithms.HMAC_SHA_512, config.getVnPay().getSecret());

        String secureHash = utils.hmacHex(hashData.toString());

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
}
