package vn.edu.funix.charity;

import com.c4_soft.springaddons.security.oauth2.test.mockmvc.AddonsWebmvcTestConf;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
@ImportAutoConfiguration({AddonsWebmvcTestConf.class})
class CharityApplicationTests {

    @Test
    void contextLoads() {
    }

}
