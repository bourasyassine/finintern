package com.leaveapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootTest
@ActiveProfiles("dev")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:oracle:thin:@localhost:1521:ORCLCDB",
    "spring.datasource.username=leaveapp_user",
    "spring.datasource.password=leaveapp_password"
})
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            assert connection != null;
            assert !connection.isClosed();
            System.out.println("✅ Connexion à Oracle Database Docker réussie!");
            System.out.println("📊 URL: " + connection.getMetaData().getURL());
            System.out.println("🔧 Version: " + connection.getMetaData().getDatabaseProductVersion());
        }
    }
} 