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
    protected Integer id;

    @Column(nullable = false)
    protected String title;

    @Column(nullable = false, unique = true, length = 300)
    protected String slug;

    @Column(nullable = false, length = 500)
    protected String description;

    @Column(nullable = false, columnDefinition = "text")
    protected String content;

    @Column(nullable = false)
    protected LocalDate deadline;

    @Column(nullable = false)
    protected Long targetAmount;

    @Column(length = 2048)
    protected String images;

    @Column(insertable = false, updatable = false, nullable = false, name = "organization_id")
    protected Integer organizationId;

    @Enumerated(EnumType.STRING)
    protected CampaignStatus status;

    @CreationTimestamp
    @Column(columnDefinition = "timestamp", updatable = false)
    protected LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(columnDefinition = "timestamp")
    protected LocalDateTime updatedAt;

    @Column(columnDefinition = "timestamp")
    protected LocalDateTime deletedAt;

    @Column(nullable = false, updatable = false)
    protected String createdByUserId;

    @Column(nullable = false)
    protected String lastUpdatedByUserId;

    @Column(nullable = false)
    protected Long totalReceivedAmount;

    @Column(nullable = false)
    protected Integer totalDonations;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    protected Organization organization;

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy = "campaign")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    protected Set<Subscriber> subscribers;

    public void setOrganization(Organization organization) {
        this.organization = organization;
        organizationId = organization.getId();
    }
}
