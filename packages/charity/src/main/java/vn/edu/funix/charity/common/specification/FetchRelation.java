package vn.edu.funix.charity.common.specification;

import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@AllArgsConstructor
public class FetchRelation<T> implements Specification<T> {
    protected List<String> relationNames;
    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (query.getResultType() != Long.class && query.getResultType() != long.class) {
            for (String relationName : relationNames) {
                var relations = relationName.split("\\.");
                var joinType = JoinType.LEFT;
                From<Object, Object> prevRoot = null;
                for (var relation : relations) {
                    var source = prevRoot != null ? prevRoot : root;
                    var tryFindFetchedRoot = source.getFetches().stream().
                }
            }
        }
        return criteriaBuilder.conjunction();
    }
}
