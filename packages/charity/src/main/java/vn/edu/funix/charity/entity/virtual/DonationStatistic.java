package vn.edu.funix.charity.entity.virtual;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
public class DonationStatistic {
    private Date date;
    private Long totalAmount;
    private Long countDonation;
}
