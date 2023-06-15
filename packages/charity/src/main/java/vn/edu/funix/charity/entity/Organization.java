package vn.edu.funix.charity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "organizations")
@Where(clause = "deleted_at is null")
@SQLDelete(sql = "UPDATE organizations SET deleted_at = now() WHERE id = ?")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phoneNumber;

    private String email;

    private String avatar;

    @CreationTimestamp
    @Column(columnDefinition = "timestamp", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(columnDefinition = "timestamp")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "timestamp")
    private LocalDateTime deletedAt;
}
