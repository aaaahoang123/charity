package vn.edu.funix.charity.features.campaign.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Organization;

import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Integer> {

    @Query("from Organization o where o.name like concat('%', :term, '%') " +
            "or o.phoneNumber like concat('%', :term, '%') " +
            "or o.email like concat('%', :term, '%') " +
            "or COALESCE(CAST(:term AS integer), -1) != -1 and o.id = cast(:term as integer)")
    List<Organization> searchByTerm(@Param("term") String term);
}
