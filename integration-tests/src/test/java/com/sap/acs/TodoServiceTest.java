// package com.sap.acs;

// import static org.hamcrest.CoreMatchers.containsString;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// import org.json.JSONObject;
// import org.junit.Test;
// import org.junit.runner.RunWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.junit4.SpringRunner;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.MvcResult;
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


// @SpringBootTest(classes = Application.class)
// @AutoConfigureMockMvc
// public class TodoServiceTest {
//     @Autowired
//     private MockMvc mockMvc;

//     private static String task_id;

//     String createPayload = "{\"task_description\":\"First task for Testing \",\"priority\":\"3\",\"status\":\"3\",\"due_by\":\"2010-05-28T15:36:56.200\"}";
//     String updatePayload = "{\"task_description\":\"Update First task for Testing\"}";

   

//     public void testCreateTask() throws Exception {

//         MvcResult result = mockMvc
//                 .perform(MockMvcRequestBuilders.post("/odata/v4/TodoService/task").content(createPayload)
//                         .contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isCreated()).andReturn();

//         String jsonString = result.getResponse().getContentAsString();
//         JSONObject jsonObject = new JSONObject(jsonString);
//         task_id = (String) jsonObject.get("TASK_ID");

//     }


//     public void testFetchTask() throws Exception {

//        MvcResult result = mockMvc
//                 .perform(MockMvcRequestBuilders.post("/odata/v4/TodoService/task").content(createPayload)
//                         .contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isCreated()).andReturn();

//         String jsonString = result.getResponse().getContentAsString();
//         JSONObject jsonObject = new JSONObject(jsonString);
//         String taskID = (String) jsonObject.get("TASK_ID");

//         mockMvc.perform(MockMvcRequestBuilders.get("/odata/v4/TodoService/task")).andExpect(status().isOk())
//                 .andExpect(jsonPath("$.value[0].task_description").value(containsString("First task for Testing")))
//                 .andExpect(jsonPath("$.value[0].priority").value(containsString("3")));
        
//          mockMvc.perform(MockMvcRequestBuilders.delete("/odata/v4/TodoService/task(" + taskID + ")"))
//                 .andExpect(status().isNoContent()); 

//     }

  

   
//     public void testDeleteTask() throws Exception {
//         System.out.println("==>?" + task_id);
//         mockMvc.perform(MockMvcRequestBuilders.delete("/odata/v4/TodoService/task(" + task_id + ")"))
//                 .andExpect(status().isNoContent());
                

//     }

// }
