package vn.edu.funix.charity.common.specification;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

public abstract class WhereHasParamSpecification<T> implements Specification<T> {
    protected Root<?> parentRoot;

    @Nullable
    public abstract Predicate toPredicateFrom(From<?, T> root, AbstractQuery<?> query, CriteriaBuilder criteriaBuilder);

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return toPredicateFrom(root, query, criteriaBuilder);
    }

    public WhereHasParamSpecification<T> setParentRoot(Root<?> parentRoot) {
        this.parentRoot = parentRoot;
        return this;
    }

    public Root<?> getParentRoot() {
        return parentRoot;
    }
}
