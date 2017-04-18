/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.unica.djestit.recording.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.unica.djestit.recording.model.Db;
import it.unica.djestit.recording.model.Gesture;
import it.unica.djestit.recording.model.GestureNode;
import it.unica.djestit.recording.model.User;
import it.unica.djestit.recording.model.UserFactory;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import json.CommandMsg;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@SessionAttributes({"user"})
public class RecordController {

    private static final String user = "user";

    @Autowired
    ServletContext servletContext;

    @RequestMapping(value = "/index.html", method = RequestMethod.GET)
    public String index(HttpSession session) {
        if (session.getAttribute(RecordController.user) == null) {
            return "login";
        } else {
            return "index-iciap";
        }

    }

    @RequestMapping(value = "/register.html")
    public String register() {
        return "register";
    }
    
    @RequestMapping(value = "/test/touch.html")
    public String touch() {
        return "touch";
    }

    @RequestMapping(value = "register.json", method = RequestMethod.POST)
    public @ResponseBody
    String newAccount(HttpSession session,
            @RequestParam(value = "username", required = true) String username,
            @RequestParam(value = "password", required = true) String password,
            @RequestParam(value = "confirm", required = true) String confirm) {
        CommandMsg msg = new CommandMsg();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        msg.setStatus(0);
        if (username.length() == 0 || !username.matches("[a-zA-Z0-9\\._\\-]{3,}")) {
            msg.setStatus(1);
            msg.setError("username", "The username must be longer than 3 characters and must not contain spaces or punctuation");
        }
        Db db = Db.getInstance();
        db.setPath(getDbPath());
        User usr = UserFactory.getInstance().getUser(db, username);
        if (usr != null) {
            msg.setStatus(1);
            msg.setError("username", "The specified username is already in use");
        }
        if(!password.equals(confirm)){
            msg.setStatus(1);
            msg.setError("password", "The passwords do not match");
        }
        
        if(msg.getStatus() == 0){
            // creo il nuovo utente
            usr = new User();
            usr.setRole(User.DEFAULT);
            usr.setUsername(username);
            usr.setPassword(password);
            if(!UserFactory.getInstance().createUser(db, usr)){
                msg.setStatus(1);
                msg.setError("username", "Impossible to create a new user, try again later");
            }else{
                session.setAttribute(RecordController.user, usr.getUsername());
            }
        }
        return gson.toJson(msg);
    }

    @RequestMapping(value = "save.json", method = RequestMethod.POST)
    public @ResponseBody
    String save(HttpSession session,
            @RequestBody Gesture gesture) {
        CommandMsg msg = new CommandMsg();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        if (session.getAttribute(RecordController.user) == null) {
            msg.setError("save", "Your session is expired");
            msg.setStatus(1);
        } else {
            String name = session.getAttribute(RecordController.user).toString();
            File gestureFolder = getGestureFolder(name);
            if (!gestureFolder.exists()) {
                gestureFolder.mkdirs();
            }
            File file = new File(gestureFolder, gesture.getName() + ".csv");
            gesture.toCSV(file.getAbsolutePath());
            msg.setStatus(0);
        }
        return gson.toJson(msg);
    }

    @RequestMapping(value = "file.json", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    public @ResponseBody
    String fileList(HttpSession session,
            @RequestParam(value = "id", required = true) String name) {
        String path = name;
        Db db = Db.getInstance();
        db.setPath(getDbPath());
        String username = session.getAttribute(RecordController.user) == null ?
                "" : session.getAttribute(RecordController.user).toString();
        User usr = UserFactory.getInstance().getUser(db, username);
        if (path.equals("#")) {
            path = "";
        }
        // gesture
        File base = new File(servletContext.getRealPath("/gesture"));
        File folder = new File(servletContext.getRealPath("/gesture/" + path));
        if (folder.exists()) {
            File[] listOfFiles;
            // hide other users' data for the default role
            if(usr.getRole() == User.DEFAULT && path.length() == 0){
                listOfFiles = new File[1];
                listOfFiles[0] = getGestureFolder(username);
            }else{
                listOfFiles = folder.listFiles();
            }
            List<GestureNode> nodes = new ArrayList<>(listOfFiles.length);
            for (File file : listOfFiles) {
                  // hide folders to default users
                GestureNode node = new GestureNode();
                String relPath = base.toURI().relativize(file.toURI()).getPath();
                node.setId(relPath);
                node.setText(file.getName());
                node.setChildren(file.isDirectory());
                node.setType(file.isFile() ? "file" : "default");
                nodes.add(node);
            }
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            return gson.toJson(nodes);
        } else {
            return "";
        }

    }

    @RequestMapping(value = "load.json", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    public @ResponseBody
    String load(
            @RequestParam(value = "name", required = true) String name) {
        File gestureFile = new File(servletContext.getRealPath("/gesture/" + name));
        if (gestureFile.exists()) {
            Gesture gesture = new Gesture();
            gesture.fromCSV(gestureFile.getAbsolutePath());
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            return gson.toJson(gesture);
        } else {
            return "[]";
        }
    }

    @RequestMapping(value = "login.json", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    public @ResponseBody
    String login(HttpSession session,
            @RequestParam(value = "username", required = true) String name,
            @RequestParam(value = "password", required = true) String password) {
        CommandMsg msg = new CommandMsg();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        if (name.length() == 0) {

            msg.setStatus(1);
            msg.setError("username", "Please, specify a username");
            return gson.toJson(msg);
        }

        Db db = Db.getInstance();
        db.setPath(getDbPath());
        User usr = UserFactory.getInstance().getUser(db, name, password);

        if (usr == null) {
            msg.setStatus(1);
            msg.setError("password", "Invalid username or password");
            return gson.toJson(msg);
        } else {
            File gestureFolder = getGestureFolder(name);
            if (!gestureFolder.exists()) {
                gestureFolder.mkdirs();
            }
            msg.setStatus(0);
            session.setAttribute(RecordController.user, name);
        }
        return gson.toJson(msg);
    }

    private File getGestureFolder(String name) {
        File gestureFolder = new File(servletContext.getRealPath("/") +
                String.format("%sgesture%s%s", File.separator, File.separator, name));
        return gestureFolder;
    }

    @RequestMapping(value = "logout.json", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    public @ResponseBody
    String logout(HttpSession session) {
        session.invalidate();
        CommandMsg msg = new CommandMsg();
        msg.setStatus(0);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(msg);
    }

    private String getDbPath() {
        File gestureFile = new File(servletContext.getRealPath("/db/db.sqlite"));
        return gestureFile.getAbsolutePath();
    }

}
