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
// public class CustomerServiceOrderITest {

// 	@Autowired
// 	private MockMvc mockMvc;

// //	@Test
// 	public void testBusinessPartnerCounts() throws Exception {
		
// 		mockMvc.perform(MockMvcRequestBuilders.get("/odata/v4/CustomerServiceOrder/BusinessPartner"))
// 			.andExpect(status().isOk())
// 			.andExpect(jsonPath("$.value", hasSize(6)));
// 	}

// //	@Test
// 	public void testBusinessPartner() throws Exception {
		
// 		mockMvc.perform(MockMvcRequestBuilders.get("/odata/v4/CustomerServiceOrder/BusinessPartner"))
// 			.andExpect(status().isOk())
// 			.andExpect(jsonPath("$.value[0].BUSINESSPARTNER").value(containsString("101")));
// 	}

// //	@Test
// 	public void testFetchBusinessPartnerServiceOrder() throws Exception {
		
// 		mockMvc.perform(MockMvcRequestBuilders.get("/odata/v4/CustomerServiceOrder/BusinessPartner?&$expand=service_orders"))
// 			.andExpect(status().isOk())
// 			.andExpect(jsonPath("$.value[0].BUSINESSPARTNER").value(containsString("101")))
// 			.andExpect(jsonPath("$.value[0].service_orders").isArray())
// 			.andExpect(jsonPath("$.value[0].service_orders[0].soldtoparty").value(containsString("101")))
// 			.andExpect(jsonPath("$.value[0].service_orders[1].soldtoparty").value(containsString("101")));
			
// 	}

	
// }
