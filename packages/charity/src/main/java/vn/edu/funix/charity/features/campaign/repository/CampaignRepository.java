package vn.edu.funix.charity.features.campaign.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Campaign;

import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer>, JpaSpecificationExecutor<Campaign> {
    Optional<Campaign> findBySlug(String slug);

    @Query("from Campaign c left join fetch c.organization o where c.slug = :slug")
    Optional<Campaign> findBySlugAndFetchOrganization(String slug);
}
