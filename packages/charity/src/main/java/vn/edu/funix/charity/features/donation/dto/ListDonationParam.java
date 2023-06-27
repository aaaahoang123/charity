package vn.edu.funix.charity.features.donation.dto;

import lombok.Data;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;

@Data
public class ListDonationParam {
    private Integer campaignId;
    private TransactionProvider provider;
    private DonationStatus status;
    private String term;
    private String role;
}
