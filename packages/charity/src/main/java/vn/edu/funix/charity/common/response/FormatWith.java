package vn.edu.funix.charity.common.response;

import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FormatWith {
    Class<? extends Formatter> value();
}
