import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const { name } = await request.json();
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return new NextResponse("Category not found", { status: 404 });
    }
    // Also consider what to do with products that belong to this category.
    // For now, we'll just delete the category.

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("Error deleting category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
