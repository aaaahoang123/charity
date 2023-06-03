package vn.edu.funix.charity.features.campaign.formatter;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import vn.edu.funix.charity.common.response.Formatter;
import vn.edu.funix.charity.common.response.ObjectToMap;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.features.storage.StorageService;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Component
@AllArgsConstructor
public class CampaignFormatter implements Formatter {
    private final ObjectToMap objectToMap;
    private final StorageService storageService;
    @Override
    public Object format(Object object) {
        if (!(object instanceof Campaign campaign))
            return object;

        Map<String, Object> result = objectToMap.compile(object);

        Collection<String> images = List.of();
        Collection<String> imageUrls = List.of();
        String rawImages = campaign.getImages();
        if (rawImages != null && !rawImages.isEmpty()) {
            images = Arrays.asList(campaign.getImages().split(","));
            imageUrls = images.stream().map(storageService::getUploadedUrl).toList();
        }

        result.put("images", images);
        result.put("imageUrls", imageUrls);

        return result;
    }
}
