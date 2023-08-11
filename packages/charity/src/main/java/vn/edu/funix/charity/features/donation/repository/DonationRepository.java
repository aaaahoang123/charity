package vn.edu.funix.charity.features.donation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>, JpaSpecificationExecutor<Donation> {
    @Query(
//            "select new vn.edu.funix.charity.entity.virtual.DonationStatistic(date(d.confirmedAt), sum(d.amount), count(d)) " +
            "select new vn.edu.funix.charity.entity.virtual.DonationStatistic(date(d.confirmedAt), sum(d.amount), count(d)) " +
            "from Donation d where d.campaignId = :campaignId " +
            "and d.status = :status " +
//            "and d.confirmedAt is not null " +
            "group by function('date', d.confirmedAt)"
    )
    List<DonationStatistic> statisticDonationByCampaignId(Integer campaignId, DonationStatus status);
}
