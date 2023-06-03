package vn.edu.funix.charity.features.storage;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/storage")
@AllArgsConstructor
public class StorageController {
    private final StorageService storageService;

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String path = storageService.store(file);
        return Map.of(
                "path", path,
                "uri", storageService.getUploadedUrl(path)
        );
    }
}
