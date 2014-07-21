/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package json;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author davide
 */
public class CommandMsg implements Serializable {
    private int status;
    private Map<String, String> errors;
    
    public CommandMsg(){
        errors = new HashMap<>();
    }
    
    public int getStatus(){
        return status;
    }
    
    public void setStatus(int status){
        this.status = status;
    }
    
    public Map<String, String> getErrors(){
        return errors;
    }
    
    public void setErrors(Map<String, String> errors){
        this.errors = errors;
    }
    
    public String getError(String error){
        if(!errors.containsKey(error)){
            return null;
        }
        
        return this.errors.get(error);
    }
    
    public void setError(String key, String value){
        errors.put(key, value);
    }
    
    
}
