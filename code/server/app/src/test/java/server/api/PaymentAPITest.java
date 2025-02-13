/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package server.api;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;
import server.db.DbManager;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PaymentAPITest {
    private static DbManager db;

    private static String session;

    @BeforeAll
    public static void setup() {
        try{
            db = new DbManager("payment_api_test", true, true, true);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @AfterAll
    public static void close() {
        db.close();
    }
}
