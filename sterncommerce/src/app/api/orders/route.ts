import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Create a new order
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const { items, totalPrice } = body; // items is an array of { product: id, quantity: number }

    if (!items || items.length === 0 || !totalPrice) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newOrder = new Order({
      user: (session.user as any).id,
      totalPrice,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    // Create order items and associate them with the new order
    for (const item of items) {
      const orderItem = new OrderItem({
        order: savedOrder._id,
        product: item.product,
        quantity: item.quantity,
        pricePerItem: (await Product.findById(item.product)).price, // Fetch price from product
      });
      await orderItem.save();
      // Optionally, decrement product stock here
    }

    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get orders (all for admin, user's own for others)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await dbConnect();
    const user = session.user as any;
    let orders;

    if (user.role === "admin") {
      // Admin sees all orders, populated with user info
      orders = await Order.find({}).populate("user", "name email");
    } else {
      // Regular user sees only their own orders
      orders = await Order.find({ user: user.id });
    }

    // You might want to populate order items for each order as well
    // This can be complex and lead to N+1 query problems if not handled carefully

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
