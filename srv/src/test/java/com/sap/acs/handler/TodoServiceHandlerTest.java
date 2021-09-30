package com.sap.acs.handler;

import static org.junit.Assert.assertEquals;



import com.sap.acs.constant.Priority;
import com.sap.acs.constant.Status;

import org.junit.Test;




public class TodoServiceHandlerTest {

   

     @Test
    public void onCreateTodoTest() {

        assertEquals("1", Priority.getValueFromKey("NORMAL"));
        assertEquals("1", Status.getValueFromKey("OPEN"));

    }


    @Test
    public void onReadTodoTest() {

        assertEquals("NORMAL", Priority.getKeyFromValue("1"));
        assertEquals("OPEN", Status.getKeyFromValue("1"));

    }
}

