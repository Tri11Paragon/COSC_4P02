/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package server;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import server.db.DbManager;
import server.web.root.api.AccountAPI;
import server.web.mail.MailServer;
import server.web.route.ClientError;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.SQLException;

public class AccountAPITest {

    private DbManager db;
    private MailServer mail;

    @Before
    public void setup() {
        try{
            db = new DbManager(true, true, false);
            mail = new MailServer("", "");
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testAccountLogin() throws SQLException, ClientError.Unauthorized, UnknownHostException {
        var account = new AccountAPI.Login();
        account.email = "yui@gmail.com";
        account.password = "password";
        String session;
        try(var trans = db.rw_transaction()){
            session = AccountAPI.login(mail, InetAddress.getByName("localhost"), "Agent", trans, account);
        }
    }

    @Test
    public void testAccountRegistration() throws ClientError.BadRequest, SQLException {
        var account = new AccountAPI.Register();
        account.name = "Parker";
        account.email = "yui@gmail.com";
        account.password = "password";
        try(var trans = db.rw_transaction()){
            AccountAPI.register(mail, trans, account);
        }
    }

    @After
    public void close() {
        db.close();
        mail.close();
    }
}
