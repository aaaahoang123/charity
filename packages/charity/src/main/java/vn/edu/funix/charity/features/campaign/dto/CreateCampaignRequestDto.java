package vn.edu.funix.charity.features.campaign.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class CreateCampaignRequestDto {
    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String description;

    @NotBlank
    @Size(max = 65535)
    private String content;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @NotNull
    private LocalDate deadline;

    @NotNull
    private Long targetAmount;

    @Size(max = 2048)
    private String images;

    private Integer organizationId;

    @NotEmpty
    @Pattern(regexp = "(((\\+|)84)|0)([35789])+([0-9]{8})\\b", message = "Số điện thoại không đúng định dạng")
    private String organizationPhone;

    @NotEmpty
    @Size(max = 255)
    private String organizationName;

    @NotEmpty
    @Size(max = 255)
    @Email
    private String organizationEmail;

    @Size(max = 255)
    private String organizationAvatar;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;
}
