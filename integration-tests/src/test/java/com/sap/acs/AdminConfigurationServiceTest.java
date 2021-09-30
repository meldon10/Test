// package com.sap.acs;

// import static org.hamcrest.CoreMatchers.containsString;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
// import static org.hamcrest.Matchers.hasSize;

// import org.junit.Test;
// import org.junit.runner.RunWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.context.junit4.SpringRunner;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

// //@RunWith(SpringRunner.class)
// @SpringBootTest(classes = Application.class)
// @AutoConfigureMockMvc
// public class AdminConfigurationServiceTest {

// 	@Autowired
// 	private MockMvc mockMvc;

// //	@Test
// 	public void testGetAdminConfigurationSize() throws Exception {
		
// 		mockMvc.perform(MockMvcRequestBuilders.get("/odata/v4/sap/opu/odata/sap/IssueConfiguration"))
// 			.andExpect(status().isOk())
// 			.andExpect(jsonPath("$.value", hasSize(3)));
// 	}

// //	@Test
// 	public void testFetchAdminConfiguration() throws Exception {
		
// 		mockMvc.perform(MockMvcRequestBuilders.get("/odata/v4/sap/opu/odata/sap/IssueConfiguration"))
// 			.andExpect(status().isOk())
// 			.andExpect(jsonPath("$.value[0].ID").value(1))
// 			.andExpect(jsonPath("$.value[0].maximumValue").value(containsString("Max")))
// 			.andExpect(jsonPath("$.value[0].color").value(containsString("Red")));
			
// 	}

	
// }
