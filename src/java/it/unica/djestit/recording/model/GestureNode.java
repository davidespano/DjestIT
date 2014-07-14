/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package it.unica.djestit.recording.model;

/**
 *
 * @author davide
 */
public class GestureNode {
    private String id;
    private transient int level;
    private String text;
    private boolean children;
    private String type;
    
    public void setId(String id){
        this.id = id;
        
    }
    
    public String getId(){
        return this.id;
    }
    
    public int getLevel(){
        return this.level;
    }
    
    public void setLevel(int level){
        this.level = level;
    }
    
    public String getText(){
        return this.text;
    }
    
    public void setText(String text){
        this.text = text;
    }
    
    public boolean getChildren(){
        return this.children;
    }
    
    public void setChildren(boolean children){
        this.children = children;
    }
    
    public void setType(String type){
        this.type = type;
    }
    
    public String getType(){
        return type;
    }
    
}
