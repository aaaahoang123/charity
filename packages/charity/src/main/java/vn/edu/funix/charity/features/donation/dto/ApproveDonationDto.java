package vn.edu.funix.charity.features.donation.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApproveDonationDto {
    @NotEmpty
    @Size(max = 50)
    private String transactionCode;
}
