package vn.edu.funix.charity.common.response;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import vn.edu.funix.charity.common.language.LocaleService;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
@RequiredArgsConstructor
public class JsonResponseInterceptor implements ResponseBodyAdvice<Object> {
    private final LocaleService localeService;
    private final ApplicationContext context;

    @Override
    public boolean supports(
            MethodParameter returnType,
            @NonNull Class<? extends HttpMessageConverter<?>> converterType
    ) {
        return !ResponseEntity.class.isAssignableFrom(Objects.requireNonNull(returnType.getMethod()).getReturnType());
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            @NonNull MethodParameter returnType,
            @NonNull MediaType selectedContentType,
            @NonNull Class<? extends HttpMessageConverter<?>> selectedConverterType,
            @NonNull ServerHttpRequest request,
            @NonNull ServerHttpResponse response) {
        if (!Objects.equals(selectedContentType, MediaType.APPLICATION_JSON)) {
            return body;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", 1);
        result.put("message", localeService.getMessage("success"));
        result.put("timestampMs", LocalDateTime.now());
        Formatter formatter = extractFormatter(returnType);
        processData(result, body, formatter);
        processMeta(result, body);
        return result;
    }

    protected @Nullable Formatter extractFormatter(MethodParameter returnType) {
        Class<? extends Formatter> formatterClass = null;

        FormatWith formatWithOfMethod = Objects.requireNonNull(returnType.getMethod())
                .getDeclaredAnnotation(FormatWith.class);

        if (formatWithOfMethod != null) {
            formatterClass = formatWithOfMethod.value();
        } else {
            FormatWith formatWithOfClass = returnType.getDeclaringClass()
                    .getDeclaredAnnotation(FormatWith.class);
            if (formatWithOfClass != null) {
                formatterClass = formatWithOfClass.value();
            }
        }

        if (formatterClass == null) {
            return null;
        }

        return context.getBean(formatterClass);
    }

    protected void processData(Map<String, Object> result, Object body, @Nullable Formatter formatter) {
        if (formatter == null) {
            if (body instanceof Page<?>) {
                result.put("data", ((Page<?>) body).getContent());
                return;
            }
            result.put("data", body);
            return;
        }

        Collection<?> collectionData = null;

        if (body instanceof Page<?>) {
            collectionData = ((Page<?>) body).getContent();
        }

        if (body instanceof Collection<?>) {
            collectionData = (Collection<?>) body;
        }

        if (collectionData != null) {
            result.put("data", collectionData.stream().map(formatter::format).toList());
            return;
        }

        result.put("data", formatter.format(body));
    }

    protected void processMeta(Map<String, Object> result, Object body) {
        if (!(body instanceof Page<?> page)) {
            return;
        }

        Map<String, Object> meta = new HashMap<>();

        meta.put("total", page.getTotalElements());
        meta.put("currentPage", page.getPageable().getPageNumber());
        meta.put("lastPage", page.getTotalPages());
        meta.put("size", page.getSize());

        result.put("meta", meta);
    }
}
