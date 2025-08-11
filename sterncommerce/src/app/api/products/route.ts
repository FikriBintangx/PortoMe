import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, price, stock, image, category } = body;

    if (!name || !description || !price || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      image,
      category,
    });

    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).populate("category", "name");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
