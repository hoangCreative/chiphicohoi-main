import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';

interface GoogleFormSetupProps {
  onBack: () => void;
}

export default function GoogleFormSetup({ onBack }: GoogleFormSetupProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Fetch the script content from the public folder or hardcode it
    // Since it's large, we'll fetch it from a public asset if possible, 
    // but for now, we'll just use a placeholder or fetch from a known route.
    // Wait, the best way is to fetch it from a file in the public folder.
    fetch('/google_form_script.gs')
      .then(res => res.text())
      .then(text => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy script:', err);
        alert('Không thể copy script. Vui lòng thử lại.');
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="mb-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hướng dẫn tạo Google Form tự động</h2>
        
        <div className="space-y-6 text-gray-600">
          <p>
            Để tạo Google Form với toàn bộ 25 câu hỏi của Tiểu Hành Tinh một cách tự động, bạn không cần phải nhập tay từng câu. Hãy làm theo các bước sau:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <p className="font-semibold text-gray-900">Mở Google Apps Script</p>
                <p>Truy cập <a href="https://script.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">script.google.com <ExternalLink className="w-3 h-3" /></a> và tạo một <strong>Dự án mới (New Project)</strong>.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <p className="font-semibold text-gray-900">Copy Script</p>
                <p className="mb-2">Nhấn nút bên dưới để copy đoạn mã (script) tạo form tự động.</p>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Đã copy!' : 'Copy Script'}
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <p className="font-semibold text-gray-900">Dán và Chạy (Run)</p>
                <p>Xóa hết nội dung cũ trong file <code>Mã.gs</code> (hoặc <code>Code.gs</code>), dán đoạn mã vừa copy vào. Sau đó nhấn nút <strong>Chạy (Run)</strong> ở thanh công cụ phía trên.</p>
                <p className="text-sm text-gray-500 mt-1">* Google sẽ yêu cầu cấp quyền truy cập để tạo Form. Hãy chọn "Review permissions" &gt; Chọn tài khoản của bạn &gt; "Advanced" &gt; "Go to project" &gt; "Allow".</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <p className="font-semibold text-gray-900">Hoàn tất</p>
                <p>Sau khi chạy xong, xem phần <strong>Nhật ký thực thi (Execution log)</strong> ở bên dưới để lấy link Form của bạn. Bạn cũng có thể tìm thấy Form mới tạo trong Google Drive của mình.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
