package vn.edu.funix.charity.common.specification;

import jakarta.persistence.criteria.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
public class FetchRelation<T> implements Specification<T> {
    protected List<String> relationNames;

    public FetchRelation(String relationName) {
        this(List.of(relationName));
    }

    @Override
    public Predicate toPredicate(@NotNull Root<T> root, CriteriaQuery<?> query, @NotNull CriteriaBuilder criteriaBuilder) {
        if (query.getResultType() != Long.class && query.getResultType() != long.class) {
            for (var relationName : relationNames) {
                var relations = relationName.split("\\.");
                var joinType = JoinType.LEFT;
                FetchParent<?, ?> prevRoot = null;
                for (var relation : relations) {
                    var source = prevRoot != null ? prevRoot : root;
                    var tryFindFetchedRoot = source.getFetches()
                            .stream()
                            .filter((f) -> Objects.equals(f.getAttribute().getName(), relation))
                            .findFirst();

                    if (tryFindFetchedRoot.isPresent()) {
                        prevRoot = tryFindFetchedRoot.get();
                    } else {
                        prevRoot = source.fetch(relation, joinType);
                    }
                }
            }
        }
        return criteriaBuilder.conjunction();
    }
}
