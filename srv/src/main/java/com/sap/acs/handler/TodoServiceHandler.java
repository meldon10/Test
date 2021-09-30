package com.sap.acs.handler;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.sap.acs.constant.Priority;
import com.sap.acs.constant.Status;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;


import org.springframework.stereotype.Component;

import cds.gen.todoservice.*;

@Component
@ServiceName(TodoService_.CDS_NAME)
public class TodoServiceHandler implements EventHandler {

    @On(event = CdsService.EVENT_CREATE, entity = Task_.CDS_NAME)
    public void onCreateTodo(Task task) {

        task.setPriority(Priority.getKeyFromValue(task.getPriority()));
        task.setStatus(Status.getKeyFromValue(task.getStatus()));

    }

     @On(event = CdsService.EVENT_UPDATE, entity = Task_.CDS_NAME)
    public void onUpdateTodo(Task task) {
        if(null != task.getPriority()){
            
            task.setPriority(Priority.getKeyFromValue(task.getPriority()));
        }
        if(null != task.getStatus()){

            task.setStatus(Status.getKeyFromValue(task.getStatus()));
        }

    }

    @After(event = CdsService.EVENT_READ, entity = Task_.CDS_NAME)
    public List<Task> onReadTodo(CdsReadEventContext context ,List<Task> tasks) {
         
      String user = context.getUserInfo().getName();
      System.out.println("User --> "+user);
       if (!tasks.isEmpty()) {
           List<Task>  filteredTasks = tasks.stream().filter(b -> b.getCreatedBy().equalsIgnoreCase(user))
                    .collect(Collectors.toList());
                   System.out.println("filteredTasks --> "+filteredTasks.size()); 
            for (Task task : filteredTasks) {
                System.out.println(task);
            task.setPriority(Priority.getValueFromKey(task.getPriority()));
            task.setStatus(Status.getValueFromKey(task.getStatus()));
           
                
        }
        if(filteredTasks.size() > 0){
            return   filteredTasks;  
        }
        }
        return tasks;

    }

   

}




