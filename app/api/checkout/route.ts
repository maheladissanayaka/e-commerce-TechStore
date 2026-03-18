import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import User from "@/models/User"; 
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const orderItems = items.map((item: any) => ({
      ...item,
      product: item._id, 
    }));

    const orderId = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder = await Order.create({
      orderId: orderId,
      user: user._id,
      items: orderItems,
      totalAmount: totalAmount,
      status: paymentMethod === "Payzy" ? "Pending Payment" : "Processing",
      paymentMethod: paymentMethod || "COD",
    });

    if (paymentMethod !== "Payzy") {
      return NextResponse.json({ 
        success: true, 
        message: "Order placed!", 
        dbOrderId: newOrder._id 
      }, { status: 201 });
    }

    const secretKey = process.env.PAYZY_SECRET_KEY!;
    const responseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`;

    const payzyData: Record<string, any> = {
      x_test_mode: "on", 
      x_shopid: "2", 
      x_amount: totalAmount.toFixed(2), // Keep as string for hash
      x_order_id: orderId, // Dynamic
      x_response_url: responseUrl, // Dynamic Next.js callback
      x_first_name: "John", 
      x_last_name: "Doe",
      x_company: "ABC Company",
      x_address: "123 Main St",
      x_country: "Sri Lanka",
      x_state: "Western",
      x_city: "Colombo",
      x_zip: "12345",
      x_phone: "1234567890",
      x_email: "exampl@email.com",
      x_ship_to_first_name: "John",
      x_ship_to_last_name: "Doe",
      x_ship_to_company: "ABC Company",
      x_ship_to_address: "123 Main St",
      x_ship_to_country: "Sri Lanka",
      x_ship_to_state: "Western",
      x_ship_to_city: "Colombo",
      x_ship_to_zip: "12345",
      x_freight: "x_freight", 
      x_platform: "custom", 
      x_version: "1.0",
      signed_field_names: "x_test_mode,x_shopid,x_amount,x_order_id,x_response_url,x_first_name,x_last_name,x_company,x_address,x_country,x_state,x_city,x_zip,x_phone,x_email,x_ship_to_first_name,x_ship_to_last_name,x_ship_to_company,x_ship_to_address,x_ship_to_country,x_ship_to_state,x_ship_to_city,x_ship_to_zip,x_freight,x_platform,x_version,signed_field_names"
    };

    const listToSign = `x_test_mode=${payzyData.x_test_mode},x_shopid=${payzyData.x_shopid},x_amount=${payzyData.x_amount},x_order_id=${payzyData.x_order_id},x_response_url=${payzyData.x_response_url},x_first_name=${payzyData.x_first_name},x_last_name=${payzyData.x_last_name},x_company=${payzyData.x_company},x_address=${payzyData.x_address},x_country=${payzyData.x_country},x_state=${payzyData.x_state},x_city=${payzyData.x_city},x_zip=${payzyData.x_zip},x_phone=${payzyData.x_phone},x_email=${payzyData.x_email},x_ship_to_first_name=${payzyData.x_ship_to_first_name},x_ship_to_last_name=${payzyData.x_ship_to_last_name},x_ship_to_company=${payzyData.x_ship_to_company},x_ship_to_address=${payzyData.x_ship_to_address},x_country=${payzyData.x_ship_to_country},x_state=${payzyData.x_ship_to_state},x_city=${payzyData.x_ship_to_city},x_zip=${payzyData.x_ship_to_zip},x_freight=${payzyData.x_freight},x_platform=${payzyData.x_platform},x_version=${payzyData.x_version},signed_field_names=${payzyData.signed_field_names}`;

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(listToSign);
    payzyData.signature = hmac.digest('base64');

    const payzyResponse = await fetch('https://api.payzypay.xyz/checkout/custom-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         ...payzyData,
         x_amount: Number(payzyData.x_amount) 
      }),
    });

    const result = await payzyResponse.json();
    if (!payzyResponse.ok || !result.url) {
      console.error("❌ PAYZY REJECTED THE REQUEST:", result);
      return NextResponse.json({ error: "Payzy API Error", details: result }, { status: 400 });
    }

    return NextResponse.json({ url: result.url }, { status: 200 });

  } catch (error) {
    console.error("Checkout processing error:", error);
    return NextResponse.json({ message: "Failed to process checkout", error }, { status: 500 });
  }
}