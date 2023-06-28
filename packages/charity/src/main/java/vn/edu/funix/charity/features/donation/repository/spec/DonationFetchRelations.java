package vn.edu.funix.charity.features.donation.repository.spec;

import vn.edu.funix.charity.common.specification.FetchRelation;
import vn.edu.funix.charity.entity.Donation;

import java.util.List;

public class DonationFetchRelations extends FetchRelation<Donation> {
    public DonationFetchRelations() {
        super(List.of("donor", "campaign", "campaign.organization"));
    }
}
