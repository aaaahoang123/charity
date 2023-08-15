package vn.edu.funix.charity.features.campaign.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer>, JpaSpecificationExecutor<Campaign> {
    Optional<Campaign> findBySlug(String slug);

    @Query("from Campaign c left join fetch c.organization o where c.slug = :slug")
    Optional<Campaign> findBySlugAndFetchOrganization(String slug);
    default Long countTotalCampaign() {
        return countByStatusNot(CampaignStatus.INITIAL);
    }

    default Long countRunningCampaign() {
        return countByStatusEquals(CampaignStatus.OPENING);
    }

    Long countByStatusNot(CampaignStatus status);

    Long countByStatusEquals(CampaignStatus status);

    List<Campaign> findByStatusIsInAndDeadlineIsLessThan(List<CampaignStatus> statuses, LocalDate deadline);
}
