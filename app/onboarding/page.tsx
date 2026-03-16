'use client';
import { useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Onboarding() {
    const { createOrganization } = useOrganizationList();
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !createOrganization) return;
        setLoading(true);

        const org = await createOrganization({ name });

        await fetch('/api/orgs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orgId: org.id, name }),
        });

        router.push('/dashboard');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-semibold text-gray-900">Create your organization</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Company name"
                        required
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? 'Creating…' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
