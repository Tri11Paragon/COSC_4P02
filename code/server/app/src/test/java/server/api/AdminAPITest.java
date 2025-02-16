/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package server.api;

import org.junit.jupiter.api.*;
import server.framework.db.DbManager;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminAPITest {
    private static DbManager db;

    private static String session;

    @BeforeAll
    public static void setup() {
        try{
            db = new DbManager("admin_api_test", true, true, true);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @AfterAll
    public static void close() {
        db.close();
    }
}
