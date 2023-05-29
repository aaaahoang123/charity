package vn.edu.funix.charity.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.security.annotation.UserId;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/need-auth")
public class NeedAuthController {
    @GetMapping
    public Map<String, Object> abc(@UserId String userId) {
        Map<String, Object> a = new HashMap<>();

        a.put("needAuth", "true");
        a.put("id", userId);
        return a;
    }
}
