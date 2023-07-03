package vn.edu.funix.charity.common.response;

import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ObjectUtils {
    private final Logger logger = LoggerFactory.getLogger(getClass());
    public Map<String, Object> objectToMap(Object obj) {
        Map<String, Object> result = new HashMap<>();

        var fields = getAllFields(obj.getClass());

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                var value = field.get(obj);
                if (Hibernate.isInitialized(value)) {
                    result.put(field.getName(), value);
                }
            } catch (IllegalAccessException ex) {
                logger.warn("Access failure at field: " + field.getName() + " of object: " + obj.getClass() + "@" + obj);
            }
        }

        return result;
    }

    public <Input, Output> void assignObject(Input input, Output output) {
        var inputFields = getAllFields(input.getClass());
        var outputFields = getAllFields(output.getClass())
                .stream()
                .collect(Collectors.toMap(Field::getName, Function.identity()));

        for (var inputField : inputFields) {
            try {
                var outputField = outputFields.get(inputField.getName());

                if (outputField == null) {
                    continue;
                }

                var value = inputField.get(input);
                if (value instanceof HibernateProxy && !Hibernate.isInitialized(value)) {
                    continue;
                }
                outputField.set(output, inputField.get(input));
            } catch (IllegalAccessException e) {
                logger.warn(e.getClass().getName() + ": " + e.getMessage());
            }
        }
    }

    private List<Field> getAllFields(Class<?> clazz) {
        if (clazz == null) {
            return List.of();
        }

        List<Field> result = new ArrayList<>(getAllFields(clazz.getSuperclass()));
        List<Field> filteredFields = Arrays.stream(clazz.getDeclaredFields())
                .filter(f -> !Modifier.isStatic(f.getModifiers()))
                .peek(f -> f.setAccessible(true))
                .toList();
        result.addAll(filteredFields);
        return result;
    }
}
