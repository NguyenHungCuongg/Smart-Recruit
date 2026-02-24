package com.smartrecruit.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String storeJobDescriptionFile(MultipartFile file, UUID jobId) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Failed to store empty file");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "jd_" + jobId + ".pdf";
            }

            // Create directory structure: uploads/jds/{jobId}/
            Path jobDir = Paths.get(uploadDir, "jds", jobId.toString());
            Files.createDirectories(jobDir);

            // Generate unique filename
            String filename = "jd_" + System.currentTimeMillis() + "_" + originalFilename;
            Path targetPath = jobDir.resolve(filename);

            // Copy file
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path
            String relativePath = "jds/" + jobId.toString() + "/" + filename;
            log.info("Stored JD file: {}", relativePath);
            
            return relativePath;
        } catch (IOException e) {
            log.error("Failed to store JD file for job {}", jobId, e);
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public String storeCVFile(MultipartFile file, UUID candidateId) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Failed to store empty file");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "cv_" + candidateId + ".pdf";
            }

            // Create directory structure: uploads/cvs/{candidateId}/
            Path candidateDir = Paths.get(uploadDir, "cvs", candidateId.toString());
            Files.createDirectories(candidateDir);

            // Generate unique filename
            String filename = "cv_" + System.currentTimeMillis() + "_" + originalFilename;
            Path targetPath = candidateDir.resolve(filename);

            // Copy file
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path
            String relativePath = "cvs/" + candidateId.toString() + "/" + filename;
            log.info("Stored CV file: {}", relativePath);
            
            return relativePath;
        } catch (IOException e) {
            log.error("Failed to store CV file for candidate {}", candidateId, e);
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deleteFile(String relativePath) {
        try {
            Path path = Paths.get(uploadDir, relativePath);
            Files.deleteIfExists(path);
            log.info("Deleted file: {}", relativePath);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", relativePath, e);
        }
    }
}
