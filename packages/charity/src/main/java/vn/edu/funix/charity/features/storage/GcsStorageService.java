package vn.edu.funix.charity.features.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.AllArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class GcsStorageService implements StorageService {
    private final GcsStorageConfiguration configuration;
    private final Storage storage;
    private final StorageHelper storageHelper;
    @Override
    public String store(MultipartFile file) throws IOException {
        String filePath = generateFilePath(file);

        BlobId blobId = BlobId.of(configuration.getGcsBucket(), filePath);

        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        storage.createFrom(blobInfo, storageHelper.tryResizeImage(file.getInputStream(), 1000, fileExtension));
        return filePath;
    }

    protected String generateFilePath(MultipartFile file) throws IOException {
        String fileNameHashing = DigestUtils.md5Hex(file.getInputStream());
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());

        String firstPartFolder = fileNameHashing.substring(0, 2);
        String secondPartFolder = fileNameHashing.substring(2, 4);

        String filePath = firstPartFolder + "/" + secondPartFolder + "/" + fileNameHashing + "." + fileExtension;
        if (!configuration.getGcsPathPrefix().isEmpty()) {
            filePath = configuration.getGcsPathPrefix() + "/" + filePath;
        }

        return filePath;
    }

    @Override
    public String getUploadedUrl(String path) {
        String filePath = path;
        if (!configuration.getGcsPathPrefix().isEmpty()) {
            filePath = configuration.getGcsPathPrefix() + "/" + filePath;
        }
        return configuration.getGcsUri() + "/" + filePath;
    }
}
