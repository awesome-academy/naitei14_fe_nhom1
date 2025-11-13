'use client';

import React, { useState } from 'react';
import { useEmail } from '@/src/hooks/useEmail';
import { EmailTemplateType } from '@/src/types/email';
import { getTemplateData } from '@/src/constants/email-mock-data';

const EmailDemo: React.FC = () => {
  const { sendEmail, sendSimpleEmail, loading, error } = useEmail();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>('welcome');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSendTemplatedEmail = async () => {
    if (!recipient) {
      alert('Vui lòng nhập email người nhận');
      return;
    }

    const templateData = getTemplateData(selectedTemplate, recipient);
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

  const emailTemplateOptions = [
    { value: 'welcome', label: 'Chào mừng' },
    { value: 'order-confirmation', label: 'Xác nhận đơn hàng' },
    { value: 'reset-password', label: 'Đặt lại mật khẩu' },
    { value: 'order-status-update', label: 'Cập nhật trạng thái đơn hàng' },
    { value: 'monthly-revenue-report', label: 'Báo cáo doanh thu hàng tháng' },
  ];

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
            {emailTemplateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Data demo cho template "{selectedTemplate}":</h4>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify(getTemplateData(selectedTemplate, recipient), null, 2)}
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
            message.includes('thành công') 
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