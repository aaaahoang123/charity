package vn.edu.funix.charity.entity;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.*;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(
        name = "campaigns",
        indexes = {
                @Index(columnList = "createdByUserId"),
                @Index(columnList = "lastUpdatedByUserId")
        }
)
@Where(clause = "deleted_at is null")
@SQLDelete(sql = "UPDATE campaigns SET deleted_at = now() WHERE id = ?")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 300)
    private String slug;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(nullable = false)
    private LocalDate deadline;

    @Column(nullable = false)
    private Long targetAmount;

    @Column(length = 2048)
    private String images;

    @Column(insertable = false, updatable = false, nullable = false, name = "organization_id")
    private Integer organizationId;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    @CreationTimestamp
    @Column(columnDefinition = "timestamp", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(columnDefinition = "timestamp")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "timestamp")
    private LocalDateTime deletedAt;

    @Column(nullable = false, updatable = false)
    private String createdByUserId;

    @Column(nullable = false)
    private String lastUpdatedByUserId;

    @Column(nullable = false)
    private Long totalReceivedAmount;

    @Column(nullable = false)
    private Integer totalDonations;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    private Organization organization;

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy = "campaign")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Subscriber> subscribers;

    public void setOrganization(Organization organization) {
        this.organization = organization;
        organizationId = organization.getId();
    }
}
