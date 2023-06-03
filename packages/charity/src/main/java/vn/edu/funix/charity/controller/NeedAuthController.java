package vn.edu.funix.charity.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.common.security.annotation.UserId;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/need-auth")
public class NeedAuthController {
    @GetMapping
    @Secured("ROLE_manage-account")
    public Map<String, Object> abc(@UserId String userId, Authentication authentication, Pageable pageable) {
        Map<String, Object> a = new HashMap<>();

        a.put("needAuth", "true");
        a.put("id", userId);
        a.put("auth", authentication);
        return a;
    }
}
