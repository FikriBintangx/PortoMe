import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    // This check is redundant if we have layout protection, but good for defense-in-depth
    if (!session || (session.user as any)?.role !== 'admin') {
        redirect('/login?callbackUrl=/admin');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p>Welcome, {session.user?.name}.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white border rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Today's Sales</h2>
                    <p className="text-3xl font-bold mt-2">$0.00</p>
                    <p className="text-gray-500">Not yet implemented.</p>
                </div>
                <div className="p-6 bg-white border rounded-lg shadow">
                    <h2 className="text-xl font-semibold">New Orders</h2>
                    <p className="text-3xl font-bold mt-2">0</p>
                    <p className="text-gray-500">Not yet implemented.</p>
                </div>
                <div className="p-6 bg-white border rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Total Products</h2>
                    <p className="text-3xl font-bold mt-2">0</p>
                    <p className="text-gray-500">Not yet implemented.</p>
                </div>
            </div>
        </div>
    );
}
