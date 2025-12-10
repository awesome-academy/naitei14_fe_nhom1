import { EmailTemplate, EmailTemplateType, WelcomeEmailData, OrderConfirmationEmailData, 
  ResetPasswordEmailData } from '@/src/types/email';

const getBaseTemplate = (content: string, title: string = 'DrinkShop') => `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 500;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #666;
            font-size: 14px;
        }
        .order-item {
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .total {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
            text-align: right;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍹 DrinkShop</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>Cảm ơn bạn đã tin tưởng DrinkShop!</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
            <p>© 2025 DrinkShop. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getWelcomeTemplate = (data: WelcomeEmailData): EmailTemplate => {
  const content = `
    <h2>Chào mừng ${escapeHtml(data.name)} đến với DrinkShop! 🎉</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại DrinkShop. Chúng tôi rất vui được chào đón bạn!</p>
    <p>Với tài khoản DrinkShop, bạn có thể:</p>
    <ul>
        <li>🛒 Đặt hàng nhanh chóng và tiện lợi</li>
        <li>📱 Theo dõi trạng thái đơn hàng</li>
        <li>🎁 Nhận thông tin khuyến mãi độc quyền</li>
        <li>⭐ Đánh giá và review sản phẩm</li>
    </ul>
    ${data.verificationLink ? `
    <p>Để hoàn tất việc đăng ký, vui lòng xác thực email của bạn:</p>
    <a href="${escapeHtml(data.verificationLink)}" class="button">Xác thực Email</a>
    ` : ''}
    <p>Chúc bạn có những trải nghiệm tuyệt vời tại DrinkShop!</p>
  `;

  return {
    subject: 'Chào mừng bạn đến với DrinkShop! 🍹',
    html: getBaseTemplate(content, 'Chào mừng đến với DrinkShop'),
    text: `Chào mừng ${data.name} đến với DrinkShop! Cảm ơn bạn đã đăng ký tài khoản.`
  };
};

const getOrderConfirmationTemplate = (data: OrderConfirmationEmailData): EmailTemplate => {
  const itemsHtml = data.items.map(item => `
    <div class="order-item">
      <div>
        <strong>${item.name}</strong><br>
        Số lượng: ${item.quantity}
      </div>
      <div>
        ${(item.price * item.quantity).toLocaleString('vi-VN')}₫
      </div>
    </div>
  `).join('');

  const content = `
    <h2>Xác nhận đơn hàng #${data.orderNumber} 📦</h2>
    <p>Xin chào ${data.customerName},</p>
    <p>Cảm ơn bạn đã đặt hàng tại DrinkShop. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
    
    <h3>Thông tin đơn hàng:</h3>
    <p><strong>Mã đơn hàng:</strong> #${data.orderNumber}</p>
    <p><strong>Ngày đặt:</strong> ${data.orderDate}</p>
    <p><strong>Địa chỉ giao hàng:</strong> ${data.shippingAddress}</p>
    
    <h3>Chi tiết sản phẩm:</h3>
    ${itemsHtml}
    
    <div class="total">
      Tổng cộng: ${data.total.toLocaleString('vi-VN')}₫
    </div>
    
    <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao đến shipper.</p>
    <p>Cảm ơn bạn đã mua sắm tại DrinkShop!</p>
  `;

  return {
    subject: `Xác nhận đơn hàng #${data.orderNumber} - DrinkShop`,
    html: getBaseTemplate(content, 'Xác nhận đơn hàng'),
    text: `Đơn hàng #${data.orderNumber} của bạn đã được xác nhận. Tổng: ${data.total.toLocaleString('vi-VN')}₫`
  };
};

const getResetPasswordTemplate = (data: ResetPasswordEmailData): EmailTemplate => {
  const content = `
    <h2>Đặt lại mật khẩu 🔐</h2>
    <p>Xin chào ${escapeHtml(data.name)},</p>
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản DrinkShop của mình.</p>
    <p>Nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
    
    <a href="${escapeHtml(data.resetLink)}" class="button">Đặt lại mật khẩu</a>
    
    <p><strong>Lưu ý quan trọng:</strong></p>
    <ul>
        <li>Link này sẽ hết hạn vào ${escapeHtml(data.expirationTime)}</li>
        <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
        <li>Không chia sẻ link này với bất kỳ ai</li>
    </ul>
    
    <p>Nếu nút không hoạt động, bạn có thể copy và dán link sau vào trình duyệt:</p>
    <p style="word-break: break-all; color: #666;">${escapeHtml(data.resetLink)}</p>
  `;

  return {
    subject: 'Đặt lại mật khẩu - DrinkShop',
    html: getBaseTemplate(content, 'Đặt lại mật khẩu'),
    text: `Đặt lại mật khẩu cho tài khoản DrinkShop. Link: ${data.resetLink} (Hết hạn: ${data.expirationTime})`
  };
};

const getOrderStatusUpdateTemplate = (data: { orderNumber: string; customerName: string; status: 'confirmed' | 'rejected'; reason?: string; }): EmailTemplate => {
  const content = `
    <h2>Cập nhật trạng thái đơn hàng #${escapeHtml(data.orderNumber)} 📦</h2>
    <p>Xin chào ${escapeHtml(data.customerName)},</p>
    <p>Đơn hàng của bạn đã <strong>${data.status === 'confirmed' ? 'được xác nhận' : 'bị từ chối'}</strong>.</p>
    ${data.status === 'rejected' && data.reason ? `<p><strong>Lý do từ chối:</strong> ${escapeHtml(data.reason)}</p>` : ''}
    <p>Cảm ơn bạn đã mua sắm tại DrinkShop!</p>
  `;

  return {
    subject: `Cập nhật trạng thái đơn hàng #${data.orderNumber}`,
    html: getBaseTemplate(content, 'Cập nhật trạng thái đơn hàng'),
    text: `Đơn hàng #${data.orderNumber} đã được ${data.status === 'confirmed' ? 'xác nhận' : 'từ chối'}.`
  };
};

const getMonthlyRevenueReportTemplate = (data: { month: string; totalRevenue: number; topProducts: { name: string; revenue: number; }[]; }): EmailTemplate => {
  const topProductsHtml = data.topProducts.map(product => `
    <li>${escapeHtml(product.name)}: ${product.revenue.toLocaleString('vi-VN')}₫</li>
  `).join('');

  const content = `
    <h2>Báo cáo doanh thu tháng ${escapeHtml(data.month)} 📊</h2>
    <p>Xin chào,</p>
    <p>Doanh thu tháng ${escapeHtml(data.month)} của bạn là <strong>${data.totalRevenue.toLocaleString('vi-VN')}₫</strong>.</p>
    <h3>Sản phẩm bán chạy:</h3>
    <ul>
      ${topProductsHtml}
    </ul>
    <p>Cảm ơn bạn đã đồng hành cùng DrinkShop!</p>
  `;

  return {
    subject: `Báo cáo doanh thu tháng ${data.month}`,
    html: getBaseTemplate(content, 'Báo cáo doanh thu'),
    text: `Doanh thu tháng ${data.month}: ${data.totalRevenue.toLocaleString('vi-VN')}₫.`
  };
};

export const getEmailTemplate = async <T>(
  templateType: EmailTemplateType,
  data: T
): Promise<EmailTemplate> => {
  switch (templateType) {
    case 'welcome':
      return getWelcomeTemplate(data as WelcomeEmailData);
    case 'order-confirmation':
      return getOrderConfirmationTemplate(data as OrderConfirmationEmailData);
    case 'reset-password':
      return getResetPasswordTemplate(data as ResetPasswordEmailData);
    case 'order-status-update':
      return getOrderStatusUpdateTemplate(data as { orderNumber: string; customerName: string; status: 'confirmed' | 'rejected'; reason?: string; });
    case 'monthly-revenue-report':
      return getMonthlyRevenueReportTemplate(data as { month: string; totalRevenue: number; topProducts: { name: string; revenue: number; }[]; });
    default:
      throw new Error(`Unknown email template type: ${templateType}`);
  }
};

export {
  getWelcomeTemplate,
  getOrderConfirmationTemplate,
  getResetPasswordTemplate,
  getOrderStatusUpdateTemplate,
  getMonthlyRevenueReportTemplate,
};