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
            return "index";
        }

    }

    @RequestMapping(value = "/register.html")
    public String register() {
        return "register";
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
            File gestureFolder = new File(servletContext.getRealPath("/gestures/"+ name));
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
    String fileList(
            @RequestParam(value = "id", required = true) String name) {
        String path = name;
        if (path.equals("#")) {
            path = "";
        }
        // gesture
        File base = new File(servletContext.getRealPath("/gestures"));
        File folder = new File(servletContext.getRealPath("/gestures/" + path));
        if (folder.exists()) {
            File[] listOfFiles = folder.listFiles();
            List<GestureNode> nodes = new ArrayList<>(listOfFiles.length);
            for (File file : listOfFiles) {
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
        File gestureFile = new File(servletContext.getRealPath("/gestures/" + name));
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
        User user = UserFactory.getInstance().getUser(db, name, password);

        if (user == null) {
            msg.setStatus(1);
            msg.setError("password", "Invalid username or password");
            return gson.toJson(msg);
        } else {
            File gestureFolder = new File(servletContext.getRealPath("/gestures/" + name));
            if (!gestureFolder.exists()) {
                gestureFolder.mkdirs();
            }
            msg.setStatus(0);
            session.setAttribute(RecordController.user, name);
        }
        return gson.toJson(msg);
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
