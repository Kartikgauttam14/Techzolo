import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Here you can save the order details to your database
      console.log("Payment successful and verified:", { razorpay_order_id, razorpay_payment_id, cart });
      return NextResponse.json({ message: "Payment verified successfully", success: true });
    } else {
      return NextResponse.json({ message: "Payment verification failed", success: false }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}