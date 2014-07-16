/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.unica.djestit.recording.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author davide
 */
public class Db {

    private String dbPath;

    private static Db singleton;

    public static Db getInstance() {
        if (singleton == null) {
            String sDriverName = "org.sqlite.JDBC";
            try {
                Class.forName(sDriverName);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(Db.class.getName()).log(Level.SEVERE, null, ex);
                return null;
            }
            singleton = new Db();
        }

        return singleton;
    }

    private Db() {

    }

    public void setPath(String path) {
        this.dbPath = path;
    }
    
    public Connection getConnection(){
        try {
            Connection conn = DriverManager.getConnection("jdbc:sqlite:" + this.dbPath);
            return conn;
        } catch (SQLException ex) {
            Logger.getLogger(Db.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

}
