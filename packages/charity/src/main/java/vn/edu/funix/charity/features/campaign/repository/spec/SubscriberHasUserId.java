package vn.edu.funix.charity.features.campaign.repository.spec;

import jakarta.persistence.criteria.AbstractQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import vn.edu.funix.charity.common.specification.WhereHasParamSpecification;
import vn.edu.funix.charity.entity.Subscriber;

@RequiredArgsConstructor
public class SubscriberHasUserId extends WhereHasParamSpecification<Subscriber> {
    private final String userId;
    @Override
    public Predicate toPredicateFrom(From<?, Subscriber> root, AbstractQuery<?> query, CriteriaBuilder cb) {
        return cb.equal(root.get("userId"), userId);
    }
}
