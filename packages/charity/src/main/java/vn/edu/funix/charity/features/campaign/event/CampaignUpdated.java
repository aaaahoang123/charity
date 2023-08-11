package vn.edu.funix.charity.features.campaign.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;

@Getter
public class CampaignUpdated extends ApplicationEvent {
    private final Campaign campaign;
    private final CampaignStatus newStatus;
    public CampaignUpdated(
            Object source,
            Campaign campaign,
            CampaignStatus newStatus
    ) {
        super(source);
        this.campaign = campaign;
        this.newStatus = newStatus;
    }
}
