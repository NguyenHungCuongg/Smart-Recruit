package com.smartrecruit.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        try {
            String[] possiblePaths = {
                "../",
                "./",
                "../../",
                System.getProperty("user.dir"),
                System.getProperty("user.dir") + "/.."
            };
            
            Dotenv dotenv = null;
            String foundPath = null;
            
            for (String path : possiblePaths) {
                File envFile = new File(path, ".env");
                if (envFile.exists()) {
                    dotenv = Dotenv.configure()
                        .directory(path)
                        .ignoreIfMissing()
                        .load();
                    foundPath = envFile.getAbsolutePath();
                    break;
                }
            }
            
            if (dotenv == null) {
                System.err.println(".env file not found in any of the expected locations:");
                for (String path : possiblePaths) {
                    System.err.println("   - " + new File(path, ".env").getAbsolutePath());
                }
                return;
            }
            
            // Add .env properties to Spring Environment
            Map<String, Object> envMap = new HashMap<>();
            dotenv.entries().forEach(entry -> {
                envMap.put(entry.getKey(), entry.getValue());
            });
            
            environment.getPropertySources()
                .addFirst(new MapPropertySource("dotenvProperties", envMap));
            
            System.out.println("Environment variables loaded from: " + foundPath);
        } catch (Exception e) {
            System.err.println("Warning: Could not load .env file - " + e.getMessage());
            e.printStackTrace();
        }
    }
}
