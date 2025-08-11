import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  orderDate: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
