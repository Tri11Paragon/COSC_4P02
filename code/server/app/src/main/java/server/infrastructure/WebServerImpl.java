package server.infrastructure;

import server.Config;
import server.Secrets;
import server.framework.db.DbManager;
import server.framework.web.TimedEvents;
import server.framework.web.WebServer;
import server.framework.web.mail.MailServer;
import server.framework.web.mail.SmtpMailServer;

import java.net.InetSocketAddress;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

public class WebServerImpl extends WebServer {

    public WebServerImpl() throws Exception {
        // Create a socket address using "Config.CONFIG.hostname" as the respective hostname and
        // "Config.CONFIG.port" as the port.
        // Currently, localhost 80
        super(new InetSocketAddress(Config.CONFIG.hostname, Config.CONFIG.port));
        server.setExecutor(Executors.newFixedThreadPool(Config.CONFIG.web_threads));


        addManagedResource(new TimedEvents()); // See timed events at main/java/server/web/route/TimedEvents
        addManagedResource(new DynamicMediaHandler());
        try{
            addManagedResource(new DbManager(Config.CONFIG.db_path, Config.CONFIG.store_db_in_memory, Config.CONFIG.wipe_db_on_start, true));
        }catch (Exception e){
            this.close();
            throw e;
        }


        {   // session expiration
            var db = getManagedResource(DbManager.class);
            db.setStatsTracker(tracker);
            var timer = getManagedResource(TimedEvents.class);
            timer.addMinutely(() -> {
                try(var trans = db.rw_transaction()){
                    try(var stmt = trans.namedPreparedStatement("delete from sessions where expiration<:now")){
                        stmt.setLong(":now", new Date().getTime());
                        stmt.execute();
                    }
                    trans.commit();
                    Logger.getGlobal().log(Level.FINE, "Ran session expiration clear");
                }catch (Exception e){
                    Logger.getGlobal().log(Level.SEVERE, "Failed to run session expiration clear", e);
                }
            });
        }

        addManagedResource(MailServer.class, new SmtpMailServer(Secrets.get("email_account"), Secrets.get("email_password")));

        new APIRouteBuilder(this).mountRoutes(this, "/", "server.infrastructure.root");
    }
}
