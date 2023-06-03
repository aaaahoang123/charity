package vn.edu.funix.charity.common.response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@Component
public class ObjectToMap {
    private final Logger logger = LoggerFactory.getLogger(ObjectToMap.class);
    public Map<String, Object> compile(Object obj) {
        Map<String, Object> result = new HashMap<>();

        Field[] fields = obj.getClass().getDeclaredFields();

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                result.put(field.getName(), field.get(obj));
            } catch (IllegalAccessException ex) {
                logger.warn("Access failure at field: " + field.getName() + " of object: " + obj.getClass() + "@" + obj);
            }
        }

        return result;
    }
}
