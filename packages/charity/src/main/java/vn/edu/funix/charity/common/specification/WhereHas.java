package vn.edu.funix.charity.common.specification;

import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@RequiredArgsConstructor
public class WhereHas<RootType, RelationType> implements Specification<RootType> {
    protected final String relation;
    protected final List<WhereHasParamSpecification<RelationType>> relationSpecs;
    protected int quantity = 1;

    @Override
    public Predicate toPredicate(Root<RootType> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        var subQuery = query.subquery(Long.class);

        Join<RootType, RelationType> join = subQuery.correlate(root).join(relation);

        var predicates = relationSpecs
                .stream()
                .map(spec -> spec.setParentRoot(root).toPredicateFrom(join, subQuery, cb))
                .toArray(Predicate[]::new);

        subQuery.where(predicates);

        if (quantity <= 1) {
            return cb.exists(subQuery);
        } else {
            subQuery.select(cb.count(join));
            return cb.greaterThanOrEqualTo(subQuery, Long.valueOf(quantity));
        }
    }

    public WhereHas<RootType, RelationType> setQuantity(int quantity) {
        this.quantity = quantity;
        return this;
    }
}
