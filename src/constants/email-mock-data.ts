import { EmailTemplateType } from '@/src/types/email';

export const getTemplateData = (template: EmailTemplateType, recipient: string) => {
  switch (template) {
    case 'welcome':
      return {
        name: 'Nguyễn Văn A',
        email: recipient,
        verificationLink: 'https://drinkshop.com/verify?token=abc123'
      };
    case 'order-confirmation':
      return {
        customerName: 'Nguyễn Văn A',
        orderNumber: 'ORD-20241118-ABC123',
        orderDate: new Date().toLocaleDateString('vi-VN'),
        items: [
          { name: 'Trà sữa trân châu', quantity: 2, price: 45000 },
          { name: 'Cà phê đá xày', quantity: 1, price: 35000 }
        ],
        total: 125000,
        shippingAddress: '123 Nguyễn Huệ, Q1, TP.HCM'
      };
    case 'reset-password':
      return {
        name: 'Nguyễn Văn A',
        resetLink: 'https://drinkshop.com/reset?token=xyz789',
        expirationTime: '15 phút'
      };
    case 'order-status-update':
      return {
        orderNumber: 'ORD-20241118-ABC123',
        customerName: 'Nguyễn Văn A',
        status: 'rejected',
        reason: 'Sản phẩm tạm hết hàng'
      };
    case 'monthly-revenue-report':
      return {
        month: '11/2024',
        totalRevenue: 5000000,
        topProducts: [
          { name: 'Trà sữa trân châu', revenue: 2000000 },
          { name: 'Cà phê đá xày', revenue: 1500000 },
          { name: 'Nước ép trái cây', revenue: 1000000 }
        ]
      };
    default:
      return {};
  }
};