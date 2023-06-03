package vn.edu.funix.charity.common.language;

import java.util.Collection;

public interface LocaleService {
    String getMessage(String key);
    String getMessage(String key, Object[] args);
    String getMessage(String key, Collection<Object> args);
}
