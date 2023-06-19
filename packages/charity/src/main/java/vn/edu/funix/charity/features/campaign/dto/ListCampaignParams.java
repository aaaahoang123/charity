package vn.edu.funix.charity.features.campaign.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;

@Data
public class ListCampaignParams {
    @Enumerated(EnumType.STRING)
    private CampaignStatus ignoreStatus;
    @Enumerated(EnumType.STRING)
    private CampaignStatus status;
    private String phone;
    private Integer id;
    private String term;
}
