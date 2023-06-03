package vn.edu.funix.charity.common.exception;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import vn.edu.funix.charity.common.language.LocaleService;
import vn.edu.funix.charity.config.ApplicationConfiguration;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@RequiredArgsConstructor
public class ApplicationExceptionHandler extends ResponseEntityExceptionHandler {
    private final LocaleService localeService;
    private final ApplicationConfiguration config;

    public ResponseEntity<Object> buildResponse(
            Throwable ex,
            String message,
            Integer customStatus,
            HttpStatus httpStatus
    ) {
        return buildResponse(ex, message, customStatus, httpStatus, null, true, null);
    }

    public ResponseEntity<Object> buildResponse(
            Throwable ex,
            String message,
            Integer customStatus,
            HttpStatus httpStatus,
            Object[] messageArgs,
            boolean reTranslate,
            Map<String, Object> extra
    ) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestampMs", LocalDateTime.now());
        response.put("status", customStatus != null ? customStatus : 0);
        response.put("message", reTranslate ? localeService.getMessage(message, messageArgs) : message);

        if (extra != null) {
            response.putAll(extra);
        }
        if (config.getDebug()) {
            StackTraceElement[] traceElement = ex.getStackTrace();
            response.put("trace", traceElement);
        }
        return new ResponseEntity<>(response, httpStatus);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode status,
            @NonNull WebRequest request
    ) {
        FieldError field = ex.getBindingResult().getFieldErrors().isEmpty()
                ? null
                : ex.getBindingResult().getFieldErrors().get(0);

        String fieldName = field != null
                ? localeService.getMessage(field.getField())
                : "";
        String message = field != null
                ? field.getDefaultMessage()
                : ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        return buildResponse(
                ex,
                fieldName + " " + message,
                null,
                HttpStatus.UNPROCESSABLE_ENTITY,
                null,
                false,
                Map.of("errors", ex.getAllErrors())
        );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleNoSuchElementException(EntityNotFoundException ex) {
        return buildResponse(
                ex,
                ex.getMessage(),
                null,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequestException(BadRequestException ex) {
        return buildResponse(
                ex,
                ex.getMessage(),
                null,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
        return buildResponse(
                ex,
                ex.getMessage(),
                null,
                HttpStatus.BAD_REQUEST
        );
    }
}
