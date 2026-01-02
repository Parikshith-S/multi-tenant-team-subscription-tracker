import { OrganizationProfile } from "@clerk/nextjs";

export default function OrgPage() {
    return (
        <div className="flex justify-center">
            <OrganizationProfile />
        </div>
    );
}