const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token, userName) => {
  const verificationUrl = `${process.env.EMAIL_VERIFICATION_BASE_URL}?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Quick Market, ${userName}!</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Verify Email Address
      </a>
      <p>Or copy and paste this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  return await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify your Quick Market account',
    html
  });
};

const sendOrderConfirmation = async (email, orderData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation - Quick Market</h2>
      <p>Your order #${orderData.id} has been confirmed!</p>
      <p><strong>Total Amount:</strong> ₦${orderData.totalAmount}</p>
      <p><strong>Delivery Fee:</strong> ₦${orderData.deliveryFee}</p>
      <p><strong>Expected Delivery:</strong> ${orderData.deliveryDate}</p>
      <p>We'll notify you when your order is ready for pickup/delivery.</p>
    </div>
  `;

  return await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `Order Confirmation #${orderData.id}`,
    html
  });
};

module.exports = {
  sendVerificationEmail,
  sendOrderConfirmation
};