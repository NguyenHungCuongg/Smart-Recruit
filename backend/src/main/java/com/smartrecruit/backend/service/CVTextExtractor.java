package com.smartrecruit.backend.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class CVTextExtractor {

    private static final String TYPE_PDF = "application/pdf";
    private static final String TYPE_DOC = "application/msword";
    private static final String TYPE_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    private final Tika tika = new Tika();

    //Kiểm tra xem file có phải là file PDF, DOC hoặc DOCX không
    public static boolean isSupportedContentType(String contentType) {
        if (contentType == null) return false;
        return contentType.equals(TYPE_PDF)
                || contentType.equals(TYPE_DOC)
                || contentType.equals(TYPE_DOCX);
    }

    //Lấy text thô từ file
    public String extractText(InputStream inputStream) throws IOException, TikaException {
        return tika.parseToString(inputStream);
    }

    //Chuẩn hóa text thô
    private static String normalizeForParsing(String text) {
        if (text == null || text.isBlank()) return "";
        return text
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .replaceAll("[ \t]+", " ")
                .replaceAll("\n+", "\n")
                .trim();
    }

    //Lấy text đã được chuẩn hóa từ file (bằng cách kết hợp 2 hàm trên)
    public String extractTextNormalized(InputStream inputStream) throws IOException, TikaException {
        String raw = extractText(inputStream);
        return raw != null ? normalizeForParsing(raw) : "";
    }
}
