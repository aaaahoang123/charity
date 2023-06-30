package vn.edu.funix.charity.features.campaign.formatter;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import vn.edu.funix.charity.common.response.Formatter;
import vn.edu.funix.charity.common.response.ObjectUtils;
import vn.edu.funix.charity.entity.Organization;
import vn.edu.funix.charity.features.storage.StorageService;

import java.util.Map;

@Lazy
@Component
@AllArgsConstructor
public class OrganizationFormatter implements Formatter {
    private final ObjectUtils objectToMap;
    private final StorageService storageService;

    @Override
    public Object format(Object object) {
        if (!(object instanceof Organization)) {
            return object;
        }

        Map<String, Object> result = objectToMap.objectToMap(object);

        if (((Organization) object).getAvatar() != null) {
            result.put("avatarUrl", storageService.getUploadedUrl(((Organization) object).getAvatar()));
        } else {
            result.put("avatarUrl", null);
        }

        return result;
    }
}
