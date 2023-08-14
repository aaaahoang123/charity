package vn.edu.funix.charity.entity.virtual;

import lombok.Getter;
import vn.edu.funix.charity.common.util.CurrencyFormatter;

@Getter
public class DonationStatistic implements CurrencyFormatter {
    private final String date;
    private final Long totalAmount;
    private final Long countDonation;
    private final String totalAmountStr;

    public DonationStatistic(Object date, Long totalAmount, Long countDonation) {
        this.date = date.toString();
        this.totalAmount = totalAmount;
        this.countDonation = countDonation;
        this.totalAmountStr = this.formatCurrency(totalAmount);
    }
}
