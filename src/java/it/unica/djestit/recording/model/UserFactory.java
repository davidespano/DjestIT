/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.unica.djestit.recording.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author davide
 */
public class UserFactory {

    private static UserFactory singleton;

    public static UserFactory getInstance() {
        if (singleton == null) {
            singleton = new UserFactory();
        }
        return singleton;
    }

    private UserFactory() {

    }

    public User getUser(Db db, String username) {
        Connection conn = db.getConnection();
        if (conn == null) {
            return null;
        }

        String query = "select * from users where username = ? ";
        try {
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, username);

            ResultSet set = stmt.executeQuery();
            User user = null;
            while (set.next()) {
                user = populateUser(user, set);

            }
            conn.close();
            return user;
        } catch (SQLException ex) {
            Logger.getLogger(UserFactory.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.close();
            } catch (SQLException ex1) {
                Logger.getLogger(UserFactory.class.getName()).log(Level.SEVERE, null, ex1);
            }
            return null;
        }
    }

    public User getUser(Db db, String username, String password) {
        Connection conn = db.getConnection();
        if (conn == null) {
            return null;
        }

        String query = "select * from users where username = ? and password = ?";
        try {
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, username);
            stmt.setString(2, password);

            ResultSet set = stmt.executeQuery();
            User user = null;
            while (set.next()) {
                user = populateUser(user, set);

            }
            conn.close();
            return user;
        } catch (SQLException ex) {
            Logger.getLogger(UserFactory.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.close();
            } catch (SQLException ex1) {
                Logger.getLogger(UserFactory.class.getName()).log(Level.SEVERE, null, ex1);
            }
            return null;
        }

    }
    
    public boolean createUser(Db db, User usr){
        Connection conn = db.getConnection();
        if (conn == null) {
            return false;
        }

        String query = "insert into users (id, username, password, role) "
                + "values (null, ?, ?, ?)";
        try {
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, usr.getUsername());
            stmt.setString(2, usr.getPassword());
            stmt.setInt(3, usr.getRole());
            return stmt.executeUpdate() == 1;
            //return true;
         } catch (SQLException ex) {
            Logger.getLogger(UserFactory.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.close();
            } catch (SQLException ex1) {
                Logger.getLogger(UserFactory.class.getName()).log(Level.SEVERE, null, ex1);
            }
            return false;
        }    
    }

    private User populateUser(User user, ResultSet set) throws SQLException {
        // exit at first loop, only one user with a
        // given username and password
        user = new User();
        user.setId(set.getInt("id"));
        user.setUsername(set.getString("username"));
        user.setPassword(set.getString("password"));
        user.setRole(set.getInt("role"));
        return user;
    }

}
