package vn.edu.funix.charity.features.campaign.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Subscriber;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface CampaignService {
    Campaign create(String userId, CreateCampaignRequestDto dto);
    Page<Campaign> list(String userId, ListCampaignParams params, Pageable pageable);

    Campaign detail(String slug);

    Campaign delete(String slug) throws BadRequestException;

    Campaign update(String slug, String userId, CreateCampaignRequestDto dto) throws BadRequestException;

    Campaign triggerSubscribe(String userId, String slug);

    Campaign triggerWillSendMail(String userId, String userEmail, String slug);

    List<Subscriber> findSubscriberOfUserWithCampaigns(String userId, Collection<Integer> campaignIds);

    List<String> findAllSubscribedMailsOfCampaign(Campaign campaign);

    List<DonationStatistic> getDonationStatisticOfCampaign(String slug);

    Map<String, Long> getCampaignStatistics();
}
