package vn.edu.funix.charity.features.campaign.repository.spec;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import vn.edu.funix.charity.entity.Organization;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@AllArgsConstructor
public class OrganizationHasTerm implements Specification<Organization> {
    private final String term;
    private final Logger logger = LoggerFactory.getLogger(OrganizationHasTerm.class);
    @Override
    public Predicate toPredicate(Root<Organization> root, @NonNull CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        String likeTerm = "%" + term + "%";
        List<Predicate> predicates = Arrays.asList(
                criteriaBuilder.like(root.get("name"), likeTerm),
                criteriaBuilder.like(root.get("phoneNumber"), likeTerm),
                criteriaBuilder.like(root.get("email"), likeTerm)
        );

        predicates = new ArrayList<>(predicates);

        try {
            int numberValue = Integer.parseInt(term);
            predicates.add(criteriaBuilder.equal(root.get("id"), numberValue));
        } catch (Exception e) {
            logger.debug("The term: " + term + " can not convert to integer, skip query by id");
        }

        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}
