// package com.sap.acs.controller;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// import com.sap.acs.Application;

// import org.junit.Test;
// import org.junit.runner.RunWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.context.junit4.SpringRunner;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
// @RunWith(SpringRunner.class)
// @SpringBootTest(classes = Application.class)
// @AutoConfigureMockMvc(addFilters = false)

// public class HealthCheckITest {
//     @Autowired
// 	private MockMvc mockMvc;

// 	@Test
// 	public void testGetApplicationHealthStatus() throws Exception {
		
// 		mockMvc.perform(MockMvcRequestBuilders.get("/health/sm"))
// 			.andExpect(status().isOk());
// 	}
// }

