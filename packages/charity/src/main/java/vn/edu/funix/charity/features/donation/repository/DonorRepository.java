package vn.edu.funix.charity.features.donation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Donor;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Integer> {
    List<Donor> findAllByCreatedByUserId(String userId);
}
