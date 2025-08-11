import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem extends Document {
  order: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  pricePerItem: number;
}

const OrderItemSchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerItem: { type: Number, required: true },
});

export default mongoose.models.OrderItem ||
  mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);
