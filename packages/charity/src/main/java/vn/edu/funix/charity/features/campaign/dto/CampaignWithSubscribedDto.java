package vn.edu.funix.charity.features.campaign.dto;

import lombok.Getter;
import lombok.Setter;
import vn.edu.funix.charity.common.response.ObjectUtils;
import vn.edu.funix.charity.entity.Campaign;

@Getter
@Setter
public class CampaignWithSubscribedDto extends Campaign {
    private static ObjectUtils utils = new ObjectUtils();

    private boolean isSubscribed = false;

    public CampaignWithSubscribedDto(Campaign campaign) {
        utils.assignObject(campaign, this);
    }
}
