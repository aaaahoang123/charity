package vn.edu.funix.charity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "donations")
@Where(clause = "deleted_at is null")
@SQLDelete(sql = "UPDATE donations SET deleted_at = now() WHERE id = ?")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long amount;

    @Column(length = 500)
    private String message;

    private String transactionCode;

    @Enumerated(EnumType.STRING)
    private TransactionProvider transactionProvider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;

    @Column(insertable = false, updatable = false, nullable = false, name = "donor_id")
    private Integer donorId;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "donor_id", referencedColumnName = "id")
    private Donor donor;

    @CreationTimestamp
    @Column(columnDefinition = "timestamp", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(columnDefinition = "timestamp")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "timestamp")
    private LocalDateTime deletedAt;
}
