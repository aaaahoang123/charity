package vn.edu.funix.charity.features.campaign.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Subscriber;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;

import java.util.Collection;
import java.util.List;

public interface CampaignService {
    Campaign create(String userId, CreateCampaignRequestDto dto);
    Page<Campaign> list(String userId, ListCampaignParams params, Pageable pageable);

    Campaign detail(String slug);

    Campaign delete(String slug) throws BadRequestException;

    Campaign update(String slug, String userId, CreateCampaignRequestDto dto) throws BadRequestException;

    Campaign triggerSubscribe(String userId, String slug);

    Campaign triggerWillSendMail(String userId, String slug);

    List<Subscriber> findSubscriberOfUserWithCampaigns(String userId, Collection<Integer> campaignIds);
}
