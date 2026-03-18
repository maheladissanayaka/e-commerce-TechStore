import crypto from 'crypto';
import { redirect } from 'next/navigation';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const x_order_id = searchParams.x_order_id as string;
  const response_code = searchParams.response_code as string;
  const signature = searchParams.signature as string;

  if (!x_order_id || !response_code || !signature) {
    return <div className="p-10 text-center">Invalid Request. Missing parameters.</div>;
  }

  // 1. Fetch original order data from your database using the order ID
  // const order = await db.orders.findUnique({ where: { id: x_order_id } });
  // if (!order) return <div>Order not found.</div>;
  
  // For demonstration, we assume you fetched the order. 
  // You need to rebuild the exact string you sent earlier, but prepended with the response_code.
  // Replace these mock variables with your actual fetched order data.
  const order = {
    x_test_mode: "true",
    x_shopid: "YOUR_SHOP_ID",
    x_amount: "100.00", // Fetch actual amount
    // ... fetch the rest of the fields exactly as they were sent
  };

  const secretKey = process.env.PAYZY_SECRET_KEY!;

  // 2. Rebuild the string to sign based on Payzy's requirements
  const listToVerify = `response_code=${response_code},x_test_mode=${order.x_test_mode},x_shopid=${order.x_shopid},x_amount=${order.x_amount},x_order_id=${x_order_id},... [ADD THE REST OF THE FIELDS HERE IN EXACT ORDER] ...,signed_field_names=response_code,x_test_mode,x_shopid,x_amount,x_order_id,...`;

  // 3. Generate verification hash
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(listToVerify);
  const generatedHash = hmac.digest('base64');

  // Fix URL encoding spaces in the returned signature
  const cleanSignature = signature.replace(/ /g, '+');

  // 4. Validate
  if (generatedHash === cleanSignature && response_code === "00") {
    // 🎉 Success! Update order status in DB to "PAID"
    // await db.orders.update({ where: { id: x_order_id }, data: { status: "PAID" } });

    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-green-50 rounded-lg text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
        <p>Thank you for your order. Your order ID is: <strong>{x_order_id}</strong></p>
      </div>
    );
  } else {
    // ❌ Failed or Invalid Signature
    // await db.orders.update({ where: { id: x_order_id }, data: { status: "FAILED" } });
    
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-red-50 rounded-lg text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Verification Failed</h1>
        <p>There was an issue verifying your payment. Please contact support.</p>
      </div>
    );
  }
}