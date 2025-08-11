import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get a single order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = params;
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Security check: Allow only admin or the user who owns the order
    const user = session.user as any;
    if (user.role !== "admin" && order.user._id.toString() !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Fetch associated order items
    const orderItems = await OrderItem.find({ order: id }).populate(
      "product",
      "name image price"
    );

    return NextResponse.json({ ...order.toObject(), items: orderItems });
  } catch (error) {
    console.error("Error fetching order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update an order's status (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    await dbConnect();
    const { id } = params;
    const { status } = await request.json(); // e.g., { "status": "completed" }

    if (!status || !["pending", "completed", "cancelled"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
