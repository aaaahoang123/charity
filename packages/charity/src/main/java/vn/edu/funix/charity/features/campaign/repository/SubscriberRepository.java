package vn.edu.funix.charity.features.campaign.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Subscriber;

import java.util.Optional;

@Repository
public interface SubscriberRepository extends JpaRepository<Subscriber, Integer> {
    Optional<Subscriber> findSubscriberByUserIdAndCampaignId(String userId, Integer campaignId);
}
