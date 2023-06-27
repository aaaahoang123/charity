package vn.edu.funix.charity.features.donation.repository.spec;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;

@RequiredArgsConstructor
public class DonationHasProvider implements Specification<Donation> {
    private final TransactionProvider provider;

    @Nullable
    @Override
    public Predicate toPredicate(Root<Donation> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return criteriaBuilder.equal(root.get("transactionProvider"), provider);
    }
}
