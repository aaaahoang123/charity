package vn.edu.funix.charity.features.payment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.PaymentConfiguration;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.HashMap;
import java.util.Map;

@Service("momoPaymentService")
@RequiredArgsConstructor
public class MomoPaymentService implements PaymentService {
    private final PaymentConfiguration paymentConfig;
    private final ApplicationConfiguration appConfig;

    private ObjectMapper mapper = new ObjectMapper();
    private RestTemplate template = new RestTemplate();

    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) throws Exception {
        String extraData = "";
        String ipnUrl = appConfig.getUrl() + "/public/momo/success";
        String orderInfo = "DNC " + donation.getId();
        String redirectUrl = appConfig.getUrl() + "/public/momo/success";
        String requestId = String.valueOf(System.currentTimeMillis());
        String requestType = "captureWallet";
//        String requestType = "payWithATM";
        String orderId = "DNC_" + donation.getId();
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
        return new PaymentInfo(payUrl, PaymentInfo.PaymentInfoOpenType.HREF, donation.getTransactionProvider(), null);
    }

    protected JsonNode performRequest(Map<String, String> data) throws JsonProcessingException {
        var dataStr = mapper.writeValueAsString(data);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        HttpEntity<String> entity = new HttpEntity<>(dataStr, headers);

        var response = template.postForEntity(paymentConfig.getMomo().getEndPoint(), entity, String.class);

        return mapper.readTree(response.getBody());
    }
}
