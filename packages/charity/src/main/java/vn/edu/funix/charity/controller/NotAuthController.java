package vn.edu.funix.charity.controller;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
public class NotAuthController {
    @GetMapping
    public Map<String, Object> abc() {
        Map<String, Object> a = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        a.put("needAuth", false);
        a.put("auth", authentication);
        return a;
    }

    @GetMapping("/test-path")
    public Map<String, Object> chan() {
        Map<String, Object> a = new HashMap<>();

        a.put("active", 1);
        return a;
    }

}
