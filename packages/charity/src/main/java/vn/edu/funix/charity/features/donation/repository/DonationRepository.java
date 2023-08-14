package vn.edu.funix.charity.features.donation.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.entity.virtual.TopDonor;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>, JpaSpecificationExecutor<Donation> {
    @Query(
//            "select new vn.edu.funix.charity.entity.virtual.DonationStatistic(date(d.confirmedAt), sum(d.amount), count(d)) " +
            "select new vn.edu.funix.charity.entity.virtual.DonationStatistic(function('date_format', d.confirmedAt,'%Y-%m'), sum(d.amount), count(d)) " +
            "from Donation d where d.campaignId = :campaignId " +
            "and d.status = :status " +
            "and d.confirmedAt is not null " +
            "group by function('date_format', d.confirmedAt,'%Y-%m')"
    )
    List<DonationStatistic> statisticDonationByCampaignId(Integer campaignId, DonationStatus status);

    @Query(
            "select new vn.edu.funix.charity.entity.virtual.DonationStatistic(function('date_format', d.confirmedAt,'%Y-%m'), sum(d.amount), count(d)) " +
            "from Donation d " +
            "where d.status = :status " +
            "and d.confirmedAt is not null " +
            "group by function('date_format', d.confirmedAt,'%Y-%m')"
    )
    List<DonationStatistic> statisticDonationAll(DonationStatus status);

    @Query(
            "select new vn.edu.funix.charity.entity.virtual.TopDonor(d.donorId, dm.name, sum(d.amount), count(distinct d.campaignId)) " +
            "from Donation d left join d.donor dm " +
            "where d.status = :status " +
            "and d.donorId is not null " +
            "and d.confirmedAt is not null " +
            "group by d.donorId"
    )
    Page<TopDonor> findTopDonors(DonationStatus status, Pageable pageable);

    default List<TopDonor> findTopDonors() {
        var donorsPage = findTopDonors(DonationStatus.CONFIRMED, PageRequest.of(0, 10));
        return donorsPage.getContent();
    }
}
