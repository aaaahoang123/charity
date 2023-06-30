package vn.edu.funix.charity.features.campaign.formatter;


import lombok.AllArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import vn.edu.funix.charity.common.response.Formatter;
import vn.edu.funix.charity.common.response.ObjectUtils;
import vn.edu.funix.charity.common.util.CurrencyFormatter;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.features.storage.StorageService;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Lazy
@Component
@AllArgsConstructor
public class CampaignFormatter implements Formatter, CurrencyFormatter {
    private final ObjectUtils objectToMap;
    private final StorageService storageService;
    private final OrganizationFormatter orgFormatter;
    @Override
    public Object format(Object object) {
        if (!(object instanceof Campaign campaign))
            return object;

        Map<String, Object> result = objectToMap.objectToMap(object);

        Collection<String> images = List.of();
        Collection<String> imageUrls = List.of();
        String rawImages = campaign.getImages();
        if (rawImages != null && !rawImages.isEmpty()) {
            images = Arrays.asList(campaign.getImages().split(","));
            imageUrls = images.stream().map(storageService::getUploadedUrl).toList();
        }

        result.put("images", images);
        result.put("imageUrls", imageUrls);
        result.put("daysRemain", Duration.between(LocalDate.now().atStartOfDay(), ((Campaign) object).getDeadline().atStartOfDay()).toDays());
        result.put("totalReceivedAmountStr", formatCurrency(((Campaign) object).getTotalReceivedAmount()));
        result.put("targetAmountStr", formatCurrency(((Campaign) object).getTargetAmount()));

        if (Hibernate.isInitialized(((Campaign) object).getOrganization())) {
            result.put("organization", orgFormatter.format(((Campaign) object).getOrganization()));
        }

        return result;
    }
}
