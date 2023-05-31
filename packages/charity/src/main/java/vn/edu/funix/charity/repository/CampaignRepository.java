package vn.edu.funix.charity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Campaign;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
}
