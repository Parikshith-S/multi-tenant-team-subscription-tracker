import { OrganizationProfile } from '@clerk/nextjs';

export default function SettingsPage() {
    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold text-gray-900">Settings</h1>
            <OrganizationProfile appearance={{ elements: { card: 'shadow-none border-0' } }} />
        </div>
    );
}
