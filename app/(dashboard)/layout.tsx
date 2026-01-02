import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b bg-white p-4 flex justify-between items-center">
                <div className="font-bold">SaaS Tracker</div>
                <div className="flex gap-4 items-center">
                    <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
                    <UserButton />
                </div>
            </nav>
            <main className="p-8">{children}</main>
        </div>
    );
}