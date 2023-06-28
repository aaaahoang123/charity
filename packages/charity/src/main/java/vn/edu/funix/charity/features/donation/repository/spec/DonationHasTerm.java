package vn.edu.funix.charity.features.donation.repository.spec;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import vn.edu.funix.charity.entity.Donation;

@RequiredArgsConstructor
public class DonationHasTerm implements Specification<Donation> {
    private final String term;

    @Nullable
    @Override
    public Predicate toPredicate(Root<Donation> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        var realTerm = "%" + term + "%";
        return cb.or(
                cb.like(root.get("message"), realTerm),
                cb.like(root.get("donor").get("name"), realTerm),
                cb.like(root.get("donor").get("phoneNumber"), realTerm),
                cb.like(root.get("donor").get("email"), realTerm)
        );
    }
}
