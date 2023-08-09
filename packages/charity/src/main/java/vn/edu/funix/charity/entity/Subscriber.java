package vn.edu.funix.charity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "subscribers",
        indexes = {
                @Index(columnList = "userId")
        }
)
public class Subscriber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "campaign_id", nullable = false, insertable = false, updatable = false)
    private Integer campaignId;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", referencedColumnName = "id")
    private Campaign campaign;

    @Column(nullable = false, length = 50)
    private String userId;

    @Column(nullable = false)
    private Boolean willSendMail;

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
        campaignId = campaign.getId();
    }
}
