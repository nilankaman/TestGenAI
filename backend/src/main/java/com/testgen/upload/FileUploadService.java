package com.testgen.upload;

import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final Logger log = LoggerFactory.getLogger(FileUploadService.class);

    @Value("${local.storage.path:D:/testgen_uploads/}")
    private String uploadBaseDir;

    private static final long MAX_BYTES = 20L * 1024 * 1024;
    private static final Set<String> ALLOWED_MIME = Set.of(
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png", "image/jpeg"
    );

    private final Tika tika = new Tika();

    public UploadResult upload(MultipartFile file, String userId) throws IOException {
        validateFile(file);

        String fileName = generateUniqueName(file.getOriginalFilename());
        Path storageDirectory = Paths.get(uploadBaseDir, userId, LocalDate.now().toString());
        
        Files.createDirectories(storageDirectory);
        Path targetLocation = storageDirectory.resolve(fileName);

        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        log.info("Successfully stored [{}] for user [{}] at {}", file.getOriginalFilename(), userId, targetLocation);
        
        return new UploadResult(targetLocation.toString(), file.getOriginalFilename(), file.getSize());
    }

    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("File exceeds 20MB limit.");
        }

        String mimeType = tika.detect(file.getInputStream());
        if (!ALLOWED_MIME.contains(mimeType)) {
            log.warn("Rejected suspicious file upload: {}", mimeType);
            throw new IllegalArgumentException("Unsupported file type: " + mimeType);
        }
    }

    public String getDownloadUrl(String filePath) {
        return "file:///" + filePath.replace("\\", "/");
    }

    private String generateUniqueName(String originalName) {
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
        }
        return UUID.randomUUID() + extension;
    }
    public record UploadResult(String filePath, String originalName, long sizeBytes) {}
}