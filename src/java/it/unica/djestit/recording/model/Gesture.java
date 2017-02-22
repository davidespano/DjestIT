/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.unica.djestit.recording.model;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author davide
 */
public class Gesture implements Serializable {

    private static final int DIMENSION = 4;
    private static final long serialVersionUID = 1L;

    private List<double[]> points;
    private String name;

    public Gesture() {
        this.points = new ArrayList<>();
    }

    public Gesture(List<double[]> points) {
        this();
        this.setPoints(points);
    }

    public void setName(String name){
        this.name = name;
    }
    
    public String getName(){
        if(name == null){
            return "default";
        }
        return name;
    }
    
    public final List<double[]> getPoints() {
        return points;
    }

    public final void setPoints(List<double[]> points) {
        for (double[] point : points) {
            if (point.length != DIMENSION) {
                return;
            }
        }
        this.points = points;
    }

    public boolean toCSV(String filename) {

        try (PrintWriter writer = new PrintWriter(new FileWriter(new File(filename)))) {
            if (points != null) {
                for (double[] point : points) {
                    String line = String.format(Locale.ROOT, "%f,%f,%f,%.0f",
                            point[0], point[1], point[2], point[3]);
                    writer.println(line);
                }
            }
            writer.flush();
        } catch (IOException ex) {
            Logger.getLogger(Gesture.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        }
        return true;
    }

    public boolean fromCSV(String filename) {
        this.points.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(new File(filename)))) {
            String line;
            while ((line = reader.readLine()) != null){
                String[] vals = line.split("\\s");
                if(vals.length == DIMENSION){
                    double[] point = new double[DIMENSION];
                    for(int i = 0; i<vals.length; i++){
                        point[i] = Double.parseDouble(vals[i]);
                    }
                    this.points.add(point);
                }
            }
        } catch (IOException ex) {
            Logger.getLogger(Gesture.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        }

        return true;
    }

}
