package vn.edu.funix.charity.features.campaign.listener;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.features.campaign.event.CampaignUpdated;
import vn.edu.funix.charity.features.campaign.service.CampaignService;

@Component
@RequiredArgsConstructor
public class SendMailWhenCampaignUpdated {
    private final JavaMailSender mailSender;
    private final CampaignService campaignService;
    private final ApplicationConfiguration config;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @EventListener
    @Async
    public void doSendMail(CampaignUpdated event) {
        var mails = campaignService.findAllSubscribedMailsOfCampaign(event.getCampaign());

        for (var mail : mails) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("hoangdo.2194@gmail.com");
            message.setTo(mail);
            message.setSubject("Đợt quyên góp " + event.getCampaign().getTitle() + " đã có cập nhật mới");
            message.setText(getMessageText(event));

            this.logger.debug("Sending email when updated campaign for: " + mail);
            mailSender.send(message);
        }
    }

    private String getMessageText(CampaignUpdated event) {
        String messageText;

        if (event.getNewStatus() != null) {
            messageText = "Đợt quyên góp "
                    + event.getCampaign().getTitle()
                    + " đã chuyển sang trạng thái "
                    + event.getNewStatus().getText()
                    + ". Vui lòng xem thêm tại "
                    + config.getFrontendUrl() + "/campaigns/" + event.getCampaign().getSlug();
        } else {
            messageText = "Đợt quyên góp "
                    + event.getCampaign().getTitle()
                    + " đã có cập nhật mới. Vui lòng xem thêm tại "
                    + config.getFrontendUrl() + "/campaigns/" + event.getCampaign().getSlug();
        }
        return messageText;
    }
}
