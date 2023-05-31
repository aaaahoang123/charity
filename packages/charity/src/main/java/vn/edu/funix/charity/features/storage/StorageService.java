package vn.edu.funix.charity.features.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String store(MultipartFile file) throws IOException;
    String getUploadedUrl(String path);
}
