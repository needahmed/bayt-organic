import * as sgMail from '@sendgrid/mail';
import { Order, OrderItem, Address } from '@prisma/client';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set in environment variables');
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
  from?: string;
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Make sure from address is properly formatted with a name
    const fromEmail = process.env.EMAIL_FROM || 'support@baytorganic.com';
    const from = options.from || `Bayt Organic <${fromEmail}>`;
    
    const msg = {
      to: options.to,
      from,
      subject: options.subject,
      text: options.text || '', 
      html: options.html,
    };

    console.log('Sending email to:', options.to);
    const response = await sgMail.send(msg);
    console.log('SendGrid response:', response);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.response && typeof error.response === 'object') {
      console.error('SendGrid error response body:', error.response.body);
    }
    return false;
  }
}

/**
 * Send a verification email to a user
 */
export async function sendVerificationEmail(
  email: string, 
  token: string,
  name: string
): Promise<boolean> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  const text = `Hello ${name},\n\nThank you for registering with Bayt Organic. Please verify your email address by clicking the following link:\n\n${verificationUrl}\n\nIf you did not create an account, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBayt Organic Team`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4caf50; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Bayt Organic</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with Bayt Organic. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If you did not create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; font-size: 14px;">${verificationUrl}</p>
      </div>
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Bayt Organic. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Please Verify Your Email - Bayt Organic',
    text,
    html,
  });
}

/**
 * Send a password reset email to a user
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  const text = `Hello ${name},\n\nWe received a request to reset your password. Click the following link to create a new password:\n\n${resetUrl}\n\nIf you did not request a password reset, please ignore this email and your password will remain unchanged.\n\nThis link will expire in 1 hour.\n\nBayt Organic Team`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4caf50; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Bayt Organic</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <h2>Hello ${name},</h2>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; font-size: 14px;">${resetUrl}</p>
      </div>
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Bayt Organic. All rights reserved.</p>
      </div>
    </div>
  `; 

  return sendEmail({
    to: email,
    subject: 'Password Reset Request - Bayt Organic',
    text,
    html,
  });
}

/**
 * Send an order confirmation email to a user
 */
export async function sendOrderConfirmationEmail(
  email: string,
  order: Order & { items: OrderItem[], shippingAddress: Address }
): Promise<boolean> {
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    // Format as Pakistani Rupees (Rs)
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Generate line items HTML
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  // Generate shipping address HTML
  const shippingAddress = order.shippingAddress;
  const addressHtml = `
    <p>${shippingAddress.name}</p>
    <p>${shippingAddress.address}</p>
    <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}</p>
    <p>${shippingAddress.country}</p>
    <p>Phone: ${shippingAddress.phone}</p>
  `;

  const orderDate = formatDate(order.createdAt);
  const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile/orders/${order.id}`;

  const text = `
    Order Confirmation - Bayt Organic
    
    Thank you for your order!
    
    Order Number: ${order.orderNumber}
    Order Date: ${orderDate}
    
    Items:
    ${order.items.map(item => `${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`).join('\n')}
    
    Subtotal: ${formatCurrency(order.subtotal)}
    Shipping: ${formatCurrency(order.shipping)}
    ${order.discount > 0 ? `Discount: ${formatCurrency(order.discount)}\n` : ''}
    Total: ${formatCurrency(order.total)}
    
    Shipping Address:
    ${shippingAddress.name}
    ${shippingAddress.address}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
    ${shippingAddress.country}
    Phone: ${shippingAddress.phone}
    
    Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
    Payment Status: ${order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
    
    You can view your order details at: ${orderUrl}
    
    Thank you for shopping with Bayt Organic!
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4caf50; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Bayt Organic</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <h2>Thank You for Your Order!</h2>
        <p>We're excited to confirm your order has been received and is being processed.</p>
        
        <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
        </div>
        
        <h3>Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Item</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right;">${formatCurrency(order.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 10px; text-align: right;">${formatCurrency(order.shipping)}</td>
            </tr>
            ${order.discount > 0 ? `
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Discount:</strong></td>
              <td style="padding: 10px; text-align: right;">${formatCurrency(order.discount)}</td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-top: 2px solid #eee;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #eee; font-weight: bold;">${formatCurrency(order.total)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="display: flex; margin-top: 30px;">
          <div style="flex: 1; padding-right: 15px;">
            <h3>Shipping Address</h3>
            ${addressHtml}
          </div>
          <div style="flex: 1; padding-left: 15px;">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</p>
            <p><strong>Status:</strong> ${order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${orderUrl}" style="background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Order Details</a>
        </div>
        
        <p style="margin-top: 30px;">If you have any questions about your order, please contact our customer service team at <a href="mailto:support@baytorganic.com">support@baytorganic.com</a>.</p>
      </div>
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Bayt Organic. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${order.orderNumber} - Bayt Organic`,
    text,
    html,
  });
} 