package vn.edu.funix.charity.common.language;

import lombok.RequiredArgsConstructor;
import org.apache.commons.text.WordUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class LocaleServiceImpl implements LocaleService {
    private final MessageSource messageSource;

    @Override
    public String getMessage(String key) {
        return getMessage(key, Collections.emptyList());
    }

    @Override
    public String getMessage(String key, @Nullable Object[] args) {
        return getMessage(key, args == null ? null : Arrays.asList(args));
    }

    @Override
    public String getMessage(String key, @Nullable Collection<Object> args) {
        Locale locale = getLocale();

        Object[] processedArgs = args == null ? null : args
                .stream()
                .map(item -> item instanceof String ? getMessage((String) item, args) : args)
                .toArray();

        return messageSource.getMessage(key, processedArgs, WordUtils.capitalize(key), locale);
    }

    private Locale getLocale() {
        return LocaleContextHolder.getLocale();
    }
}
