/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.unica.djestit.recording.controllers;

import com.google.gson.Gson;
import it.unica.djestit.recording.model.Gesture;
import java.io.File;
import javax.servlet.ServletContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

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

    @RequestMapping(value = "load.json", method = RequestMethod.GET)
    public String load(ModelMap map,
            @RequestParam(value = "name", required = true) String name) {
        File base = new File(servletContext.getRealPath("/gestures"));
        File file = new File(base, name + ".csv");
        Gesture gesture = new Gesture();
        gesture.fromCSV(file.getAbsolutePath());
        Gson gson = new Gson();
        map.put("gestureJson", gson.toJson(gesture));
        return "load";
    }

}
