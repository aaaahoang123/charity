package vn.edu.funix.charity.features.campaign.controller;

import com.c4_soft.springaddons.security.oauth2.test.annotations.WithMockJwtAuth;
import com.c4_soft.springaddons.security.oauth2.test.mockmvc.AddonsWebmvcTestConf;
import com.c4_soft.springaddons.security.oauth2.test.mockmvc.MockMvcSupport;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;

import java.time.LocalDate;

@SpringBootTest
@AutoConfigureMockMvc
@ImportAutoConfiguration({AddonsWebmvcTestConf.class})
public class CampaignControllerTest {
    @Autowired
    private MockMvcSupport mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Create campaign and return success")
    @WithMockJwtAuth
    public void testCreateCampaignSuccess() throws Exception {
        CreateCampaignRequestDto dto = new CreateCampaignRequestDto();
        dto.setTitle("Chan che");
        dto.setDescription("Test1");
        dto.setContent("Content test");
        dto.setTargetAmount(12345L);
        dto.setImages("1.png");
        dto.setDeadline(LocalDate.now());
        dto.setOrganizationName("tcv");
        dto.setOrganizationEmail("2@gmail.com");
        dto.setOrganizationPhone("0987654321");
        dto.setOrganizationAvatar("123.png");

        String campaignString = objectMapper.writeValueAsString(dto);
        System.out.println(campaignString);

        mvc.perform(
                MockMvcRequestBuilders.post("/api/v1/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(campaignString)

        ).andExpect(MockMvcResultMatchers.status().isOk());
    }
}
