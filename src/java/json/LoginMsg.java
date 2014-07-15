/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package json;

import java.io.Serializable;

/**
 *
 * @author davide
 */
public class LoginMsg implements Serializable {
    private String status;
    private String loginError;
    
    public String getStatus(){
        return status;
    }
    
    public void setStatus(String status){
        this.status = status;
    }
    
    public String getLoginError(){
        return loginError;
    }
    
    public void setLoginError(String loginError){
        this.loginError = loginError;
    }
    
    
}
