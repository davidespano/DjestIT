/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.unica.djestit.recording.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.unica.djestit.recording.model.Gesture;
import it.unica.djestit.recording.model.GestureNode;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RecordController {

    @Autowired
    ServletContext servletContext;

    @RequestMapping(value = "/index.html", method = RequestMethod.GET)
    public String index() {
        return "index";
    }

    @RequestMapping(value = "save.json", method = RequestMethod.POST)
    public String save(@RequestBody Gesture gesture) {
        File base = new File(servletContext.getRealPath("/gestures"));
        File file = new File(base, gesture.getName() + ".csv");
        gesture.toCSV(file.getAbsolutePath());
        return "save";
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
        File base =new File(servletContext.getRealPath("/gestures"));
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

}
