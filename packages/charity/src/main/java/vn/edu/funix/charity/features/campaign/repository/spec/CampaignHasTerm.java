package vn.edu.funix.charity.features.campaign.repository.spec;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import vn.edu.funix.charity.common.util.StringToSlug;
import vn.edu.funix.charity.entity.Campaign;

@AllArgsConstructor
public class CampaignHasTerm implements Specification<Campaign> {
    private String term;
    @Override
    public Predicate toPredicate(Root<Campaign> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        String slugTerm = StringToSlug.compile(term);
        return criteriaBuilder.like(root.get("slug"), "%" + slugTerm + "%");
    }
}
