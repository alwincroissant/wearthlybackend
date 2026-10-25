import Notification from "../model/Notification.js";

/**
 * Persist an in-app notification ledger entry.
 */
export const sendNotification = async ({
  recipientId,
  type,
  subject,
  message,
  orderId = null,
  productId = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      channel: "in_app",
      type,
      subject,
      message,
      order: orderId,
      product: productId,
    });

    console.log(`[Notification] Created for user ${recipientId}: [${subject}]`);
    return notification;
  } catch (error) {
    console.error("Failed to send notification:", error.message);
    return null;
  }
};

/**
 * Create an order confirmation notification.
 */
export const notifyOrderPlaced = async (order, user) => {
  const subject = `Wearthly Order Confirmation — ${order.orderNumber}`;
  const itemsText = (order.orderItems || [])
    .map((i) => `• ${i.quantity}x ${i.name} — ₱${(i.price * i.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}`)
    .join("\n");

  const message = `Dear ${user.firstName || "Customer"},\n\n` +
    `Thank you for your order with Wearthly!\n\n` +
    `Order Number: ${order.orderNumber}\n` +
    `Fulfillment: ${order.shippingInfo?.fulfillmentMethod === "delivery" ? "Door-to-Door Delivery" : "Dealership Pickup"}\n` +
    `Destination: ${order.shippingInfo?.address || order.shippingInfo?.branch || "Showroom"}\n` +
    `Payment Method: ${order.paymentMethod?.replace(/_/g, " ")}\n` +
    `Payment Status: ${order.paymentStatus}\n` +
    `Total Amount: ₱${order.totalPrice?.toLocaleString("en-US", { minimumFractionDigits: 2 })}\n\n` +
    `Items:\n${itemsText}\n\n` +
    `You can track your order status in your Wearthly Account under My Orders.`;

  return sendNotification({
    recipientId: user._id,
    type: "order_summary",
    subject,
    message,
    orderId: order._id,
  });
};
