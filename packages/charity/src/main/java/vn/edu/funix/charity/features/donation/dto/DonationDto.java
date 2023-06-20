package vn.edu.funix.charity.features.donation.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;

@Data
public class DonationDto {
    @NotNull
    @Min(0)
    private Long amount;

    private String message;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionProvider transactionProvider;

    private Integer donorId;
    private String donorName;
    private String donorPhoneNumber;
    private String donorEmail;

    @NotNull
    @Length(max = 300)
    private String campaignSlug;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;
}
