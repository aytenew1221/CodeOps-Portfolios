import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import StaffOrders from "./StaffOrders";

export default async function StaffPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "staff") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-700">
            Staff access required
          </h1>

          <p className="mt-2 text-red-600">
            Your account does not have permission to access this page.
          </p>
        </div>
      </main>
    );
  }

  const orders = getAllOrders();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Staff Dashboard
      </p>

      <h1 className="mt-2 text-4xl font-extrabold">Order Management</h1>

      <p className="mt-3 text-gray-600">
        Staff members can update order status.
      </p>

      <StaffOrders orders={orders} />
    </main>
  );
}
