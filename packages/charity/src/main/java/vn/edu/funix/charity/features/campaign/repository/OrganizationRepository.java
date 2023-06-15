package vn.edu.funix.charity.features.campaign.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Integer>, JpaSpecificationExecutor<Organization> {
}
