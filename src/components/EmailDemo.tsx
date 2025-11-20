'use client';

import React, { useState } from 'react';
import { useEmail } from '@/src/hooks/useEmail';
import { EmailTemplateType } from '@/src/types/email';

const EmailDemo: React.FC = () => {
  const { sendEmail, sendSimpleEmail, loading, error } = useEmail();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>('welcome');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const getTemplateData = (template: EmailTemplateType) => {
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
          shippingAddress: '123 Nguyễn Huệ , Q1, TP.HCM'
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

  const handleSendTemplatedEmail = async () => {
    if (!recipient) {
      alert('Vui lòng nhập email người nhận');
      return;
    }

    const templateData = getTemplateData(selectedTemplate);
    const success = await sendEmail(selectedTemplate, recipient, templateData);
    
    if (success) {
      setMessage('Gửi email thành công!');
    } else {
      setMessage('Gửi email thất bại: ' + (error || 'Lỗi không xác định'));
    }
  };

  const handleSendSimpleEmail = async () => {
    if (!recipient) {
      alert('Vui lòng nhập email người nhận');
      return;
    }

    const success = await sendSimpleEmail(
      recipient,
      'Test Email từ DrinkShop',
      '<h2>Chào bạn!</h2><p>Đây là email test từ hệ thống DrinkShop.</p>',
      'Chào bạn! Đây là email test từ hệ thống DrinkShop.'
    );
    
    if (success) {
      setMessage('Gửi email đơn giản thành công!');
    } else {
      setMessage('Gửi email thất bại: ' + (error || 'Lỗi không xác định'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Demo Gửi Email
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email người nhận:
          </label>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn template email:
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as EmailTemplateType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="welcome">Chào mừng</option>
            <option value="order-confirmation">Xác nhận đơn hàng</option>
            <option value="reset-password">Đặt lại mật khẩu</option>
            <option value="order-status-update">Cập nhật trạng thái đơn hàng</option>
            <option value="monthly-revenue-report">Báo cáo doanh thu hàng tháng</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Data demo cho template "{selectedTemplate}":</h4>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify(getTemplateData(selectedTemplate), null, 2)}
          </pre>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSendTemplatedEmail}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : `Gửi email ${selectedTemplate}`}
          </button>
          
          <button
            onClick={handleSendSimpleEmail}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi email đơn giản'}
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDemo;