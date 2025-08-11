import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
        <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin" className="hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:bg-gray-700 p-2 rounded">
            Products
          </Link>
          <Link href="/admin/categories" className="hover:bg-gray-700 p-2 rounded">
            Categories
          </Link>
          <Link href="/admin/orders" className="hover:bg-gray-700 p-2 rounded">
            Orders
          </Link>
          <Link href="/admin/reports" className="hover:bg-gray-700 p-2 rounded">
            Reports
          </Link>
        </nav>
      </aside>
      <div className="flex-grow p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
