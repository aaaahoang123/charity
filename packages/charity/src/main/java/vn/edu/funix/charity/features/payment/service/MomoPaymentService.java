package vn.edu.funix.charity.features.payment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.PaymentConfiguration;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service("momoPaymentService")
@RequiredArgsConstructor
public class MomoPaymentService implements PaymentService {
    private final PaymentConfiguration paymentConfig;
    private final ApplicationConfiguration appConfig;

    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate template = new RestTemplate();
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) throws Exception {
        String extraData = "";
        String ipnUrl = appConfig.getUrl() + "/public/momo/" + donation.getId();
        String orderInfo = generateOrderInfo(donation);
        String redirectUrl = appConfig.getUrl() + getRedirectUri(donation);
        String requestId = String.valueOf(System.currentTimeMillis());
//        String requestType = "captureWallet";
        String requestType = "payWithATM";
        String orderId = generateOrderId(donation);
        Map<String, String> data = new HashMap<>();

        data.put("partnerCode", paymentConfig.getMomo().getPartnerCode());
        data.put("partnerName", "Test");
        data.put("storeId", "MomoTestStore");
        data.put("requestId", requestId);
        data.put("amount", donation.getAmount().toString());
        data.put("orderId", orderId);
        data.put("orderInfo", "DNC " + donation.getId());
        data.put("redirectUrl", redirectUrl);
        data.put("ipnUrl", ipnUrl);
        data.put("lang", "vi");
        data.put("extraData", extraData);
        data.put("requestType", requestType);

        var rawHash = "accessKey="
                + paymentConfig.getMomo().getAccessKey()
                + "&amount="
                + donation.getAmount()
                + "&extraData="
                + extraData
                + "&ipnUrl="
                + ipnUrl
                + "&orderId="
                + orderId
                + "&orderInfo="
                + orderInfo
                + "&partnerCode="
                + paymentConfig.getMomo().getPartnerCode()
                + "&redirectUrl="
                + redirectUrl
                + "&requestId="
                + requestId
                + "&requestType="
                + requestType;

        var utils = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, paymentConfig.getMomo().getSecretKey());

        String signature = utils.hmacHex(rawHash);

        data.put("signature", signature);

        JsonNode response = performRequest(data);

        String payUrl = response.get("payUrl").asText();
        return new PaymentInfo(payUrl, PaymentInfo.PaymentInfoOpenType.HREF, donation.getTransactionProvider(), null, null);
    }

    protected JsonNode performRequest(Map<String, String> data) throws JsonProcessingException {
        var dataStr = mapper.writeValueAsString(data);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        HttpEntity<String> entity = new HttpEntity<>(dataStr, headers);

        var response = template.postForEntity(paymentConfig.getMomo().getEndPoint(), entity, String.class);

        return mapper.readTree(response.getBody());
    }

    @Override
    public String confirmPayment(Donation donation, Map<String, Object> meta) {
         String partnerCode = getValue(meta, "partnerCode");
         String accessKey = paymentConfig.getMomo().getAccessKey();
         String secretKey = paymentConfig.getMomo().getSecretKey();
         String orderId = getValue(meta, "orderId");
         String message = getValue(meta, "message");
         String transId = getValue(meta, "transId");
         String orderInfo = getValue(meta, "orderInfo");
         String amount = getValue(meta, "amount");
         String resultCode = getValue(meta, "resultCode");
         String responseTime = getValue(meta, "responseTime");
         String requestId = getValue(meta, "requestId");
         String extraData = getValue(meta, "extraData");
         String payType = getValue(meta, "payType");
         String orderType = getValue(meta, "orderType");
         String m2signature = getValue(meta, "signature");

         var rawHash = "accessKey=" +
                 accessKey +
                 "&amount=" +
                 amount +
                 "&extraData=" +
                 extraData +
                 "&message=" +
                 message +
                 "&orderId=" +
                 orderId +
                 "&orderInfo=" +
                 orderInfo +
                 "&orderType=" +
                 orderType +
                 "&partnerCode=" +
                 partnerCode +
                 "&payType=" +
                 payType +
                 "&requestId=" +
                 requestId +
                 "&responseTime=" +
                 responseTime +
                 "&resultCode=" +
                 resultCode +
                 "&transId=" +
                 transId;

        var utils = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, secretKey);

        String signature = utils.hmacHex(rawHash);

        if (!Objects.equals(m2signature, signature)) {
            logger.error("The momo transaction with: " + transId + " can be hacked because the signature is not matching");
            return null;
        }

        if (
                !Objects.equals(generateOrderId(donation), orderId)
                || !Objects.equals(generateOrderInfo(donation), orderInfo)
        ) {
            logger.error("The momo transaction's information is not matched");
            return null;
        }

        if (!"0".equals(resultCode)) {
            logger.error("The momo transaction's has returned with resultCode " + resultCode + " and message " + message);
            return null;
        }

        return transId;

    }

    private String generateOrderId(Donation donation) {
        return "DNC_" + donation.getId();
    }

    private String generateOrderInfo(Donation donation) {
        return "DNC " + donation.getId();
    }

    private String getValue(Map<String, Object> meta, String key) {
        return meta.containsKey(key) ? (String) meta.get(key) : "";
    }
}
