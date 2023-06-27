package vn.edu.funix.charity.features.donation.formatter;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import vn.edu.funix.charity.common.response.Formatter;
import vn.edu.funix.charity.common.response.ObjectToMap;
import vn.edu.funix.charity.common.util.CurrencyFormatter;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.campaign.formatter.CampaignFormatter;

@Lazy
@Component
@RequiredArgsConstructor
public class DonationFormatter implements Formatter, CurrencyFormatter {
    private final ObjectToMap objectToMap;
    private final CampaignFormatter campaignFormatter;

    @Override
    public Object format(Object object) {
        if (!(object instanceof Donation donation))
            return object;

        var result = objectToMap.compile(object);

        result.put("amountStr", formatCurrency(donation.getAmount()));

        if (Hibernate.isInitialized(donation.getCampaign())) {
            result.put("campaign", campaignFormatter.format(donation.getCampaign()));
        }

        return result;
    }
}
