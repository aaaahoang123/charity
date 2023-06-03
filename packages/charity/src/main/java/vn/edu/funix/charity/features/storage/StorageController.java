package vn.edu.funix.charity.features.storage;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/storage")
@AllArgsConstructor
public class StorageController {
    private final StorageService storageService;

    @PostMapping
    public Map<String, Object> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String path = storageService.store(file);
        return Map.of(
                "path", path,
                "uri", storageService.getUploadedUrl(path)
        );
    }
}
