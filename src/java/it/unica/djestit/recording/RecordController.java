/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package it.unica.djestit.recording;

import javax.servlet.ServletContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestParam;
@Controller
public class RecordController {
    
    @Autowired
    ServletContext servletContext;
    
    @RequestMapping(value="/index.html", method= RequestMethod.GET)
    public String index(){
        
        return "index";
    }
    
    @RequestMapping(value="record.json",  method= RequestMethod.POST)
    public String record(
            ModelMap map,
            @RequestParam(value = "name", required = true) String name,
            @RequestParam(value="points", required = true) String[] values) {
        System.out.println(values);
        return "record";
    }
    
}
