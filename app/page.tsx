import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  // If user is already logged in, send them straight to the dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">SaaS Subscription Tracker</h1>
      <p className="text-xl text-gray-600 mb-8">
        Manage your team's subscriptions securely.
      </p>

      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}