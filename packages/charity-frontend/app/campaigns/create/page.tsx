import CampaignForm from "@/app/campaigns/form";
import NeedAuth from "@/app/common/component/need-auth";
import {Role} from "@/app/core/role";

const CreateCampaign = () => {
    return (
        // @ts-expect-error Server Component
        <NeedAuth roles={[Role.ROLE_ADMIN]}>
            <CampaignForm />
        </NeedAuth>
    );
};

export default CreateCampaign;