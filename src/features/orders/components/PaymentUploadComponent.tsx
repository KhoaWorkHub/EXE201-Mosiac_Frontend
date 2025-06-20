// src/features/orders/components/PaymentUploadComponent.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Typography, 
  Steps, 
  Alert, 
  Tag, 
  Divider,
  Space,
  Image,
  Modal,
  message,
  Progress
} from 'antd';
import { 
  UploadOutlined, 
  CheckCircleOutlined, 
  BankOutlined,
  MobileOutlined,
  CopyOutlined,
  QrcodeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatVND } from '@/utils/formatters';

const { Title, Text } = Typography;
const { Step } = Steps;

interface PaymentUploadProps {
  orderNumber: string;
  totalAmount: number;
  onPaymentProofUpload: (file: File, method: 'MOMO' | 'BANK_TRANSFER') => Promise<void>;
  onComplete: () => void;
}

const PaymentUploadComponent: React.FC<PaymentUploadProps> = ({
  orderNumber,
  totalAmount,
  onPaymentProofUpload,
  onComplete,
}) => {
   useTranslation(['checkout', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<'MOMO' | 'BANK_TRANSFER' | null>(null);
  const [, setUploadedProofs] = useState<{[key: string]: boolean}>({});
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Payment methods data
  const paymentMethods = {
    MOMO: {
      name: 'MoMo E-Wallet',
      icon: <MobileOutlined className="text-2xl text-pink-500" />,
      color: 'pink',
      qrCode: '/assets/payment/momo-qr.png', // Placeholder
      accountInfo: {
        phone: '0833 223 299',
        name: 'MOSAIC STORE'
      },
      instructions: [
        'Mở ứng dụng MoMo trên điện thoại',
        'Chọn "Quét QR" hoặc "Chuyển tiền"',
        'Quét mã QR hoặc nhập số điện thoại',
        'Nhập số tiền chính xác',
        'Nhập nội dung: "MOSAIC ' + orderNumber + '"',
        'Xác nhận và thực hiện thanh toán',
        'Chụp ảnh màn hình kết quả và tải lên'
      ]
    },
    BANK_TRANSFER: {
      name: 'Chuyển khoản ngân hàng',
      icon: <BankOutlined className="text-2xl text-blue-500" />,
      color: 'blue',
      qrCode: '/assets/payment/bank-qr.png', // Placeholder
      accountInfo: {
        bank: 'Vietcombank',
        accountNumber: '0123456789',
        accountName: 'CONG TY MOSAIC STORE'
      },
      instructions: [
        'Mở ứng dụng banking của bạn',
        'Chọn "Chuyển khoản" hoặc "Quét QR"',
        'Quét mã QR hoặc nhập thông tin tài khoản',
        'Nhập số tiền chính xác',
        'Nhập nội dung: "MOSAIC ' + orderNumber + '"',
        'Xác nhận và thực hiện chuyển khoản',
        'Chụp ảnh màn hình kết quả và tải lên'
      ]
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã copy ${label}!`);
  };

  // Handle file upload
  const handleUpload = async (file: File) => {
    if (!selectedMethod) {
      message.error('Vui lòng chọn phương thức thanh toán!');
      return false;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onPaymentProofUpload(file, selectedMethod);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadedProofs(prev => ({
        ...prev,
        [selectedMethod]: true
      }));
      
      message.success('Upload minh chứng thanh toán thành công!');
      
      setTimeout(() => {
        setCurrentStep(3);
      }, 1000);
      
    } catch {
      message.error('Upload thất bại, vui lòng thử lại!');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    return false; // Prevent default upload
  };

  // Render payment method selection
  const renderPaymentMethods = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(paymentMethods).map(([key, method]) => (
        <motion.div
          key={key}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedMethod === key 
                ? `border-${method.color}-500 bg-${method.color}-50 dark:bg-${method.color}-900/10 shadow-lg ring-2 ring-${method.color}-200` 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedMethod(key as 'MOMO' | 'BANK_TRANSFER');
              setCurrentStep(1);
            }}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className={`w-16 h-16 rounded-full bg-${method.color}-100 dark:bg-${method.color}-900/20 flex items-center justify-center`}>
                  {method.icon}
                </div>
              </div>
              <Title level={4} className="mb-2">
                {method.name}
              </Title>
              <Text className="text-gray-600 dark:text-gray-400">
                {key === 'MOMO' ? 'Thanh toán qua ví điện tử' : 'Chuyển khoản trực tiếp'}
              </Text>
              {selectedMethod === key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-3"
                >
                  <Tag color={method.color} className="animate-pulse">
                    <CheckCircleOutlined className="mr-1" />
                    Đã chọn
                  </Tag>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  // Render payment instructions
  const renderPaymentInstructions = () => {
    if (!selectedMethod) return null;
    
    const method = paymentMethods[selectedMethod];
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code and Account Info */}
        <Card className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <QrcodeOutlined className="text-3xl text-white" />
            </div>
            <Title level={4}>Quét mã QR để thanh toán</Title>
          </div>
          
          {/* QR Code Image */}
          <div className="mb-6 flex justify-center">
            <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <QrcodeOutlined className="text-4xl text-gray-400 mb-2" />
                <Text className="text-gray-500">QR Code Demo</Text>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <Title level={5} className="mb-3">Thông tin tài khoản</Title>
            
            {selectedMethod === 'MOMO' ? (
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between items-center">
                  <Text>Số điện thoại:</Text>
                  <div className="flex items-center">
                    <Text strong className="mr-2">{'phone' in method.accountInfo ? method.accountInfo.phone : ''}</Text>
                    <Button 
                      type="text" 
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard('phone' in method.accountInfo ? method.accountInfo.phone : '', 'số điện thoại')}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Text>Tên tài khoản:</Text>
                  <Text strong>{'name' in method.accountInfo ? method.accountInfo.name : ''}</Text>
                </div>
              </Space>
            ) : (
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between items-center">
                  <Text>Ngân hàng:</Text>
                  <Text strong>{'bank' in method.accountInfo ? method.accountInfo.bank : ''}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text>Số tài khoản:</Text>
                  <div className="flex items-center">
                    <Text strong className="mr-2">{'accountNumber' in method.accountInfo ? method.accountInfo.accountNumber : ''}</Text>
                    <Button 
                      type="text" 
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard('accountNumber' in method.accountInfo ? method.accountInfo.accountNumber : '', 'số tài khoản')}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Text>Tên tài khoản:</Text>
                  <Text strong>{'accountName' in method.accountInfo ? method.accountInfo.accountName : ''}</Text>
                </div>
              </Space>
            )}
          </div>

          {/* Payment Amount */}
          <Alert
            message={
              <div className="flex justify-between items-center">
                <span>Số tiền cần thanh toán:</span>
                <span className="text-xl font-bold text-red-500">
                  {formatVND(totalAmount)}
                </span>
              </div>
            }
            type="warning"
            showIcon
            className="mb-4"
          />

          {/* Transfer Content */}
          <Alert
            message={
              <div className="flex justify-between items-center">
                <span>Nội dung chuyển khoản:</span>
                <div className="flex items-center">
                  <Text strong className="mr-2">MOSAIC {orderNumber}</Text>
                  <Button 
                    type="text" 
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(`MOSAIC ${orderNumber}`, 'nội dung chuyển khoản')}
                  />
                </div>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>

        {/* Instructions */}
        <Card>
          <Title level={4} className="mb-4">
            <InfoCircleOutlined className="mr-2 text-blue-500" />
            Hướng dẫn thanh toán
          </Title>
          
          <div className="space-y-3">
            {method.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <Text className="dark:text-gray-300">{instruction}</Text>
              </motion.div>
            ))}
          </div>

          <Divider />

          <Alert
            message="Lưu ý quan trọng"
            description={
              <ul className="mt-2 space-y-1">
                <li>• Vui lòng chuyển khoản ĐÚNG số tiền và nội dung</li>
                <li>• Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán</li>
                <li>• Thời gian xác nhận: 5-15 phút trong giờ hành chính</li>
                <li>• Liên hệ hotline 0833 223 299 nếu cần hỗ trợ</li>
              </ul>
            }
            type="warning"
            showIcon
          />

          <div className="mt-6 text-center">
            <Button 
              type="primary" 
              size="large"
              onClick={() => setCurrentStep(2)}
              className="w-full"
            >
              Tôi đã thanh toán, tiếp tục
              <CloudUploadOutlined className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Render upload section
  const renderUploadSection = () => (
    <Card className="text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
          <CameraOutlined className="text-3xl text-white" />
        </div>
        <Title level={3}>Upload minh chứng thanh toán</Title>
        <Text className="text-gray-600 dark:text-gray-400">
          Vui lòng chụp ảnh màn hình kết quả thanh toán và tải lên
        </Text>
      </div>

      {uploading && (
        <div className="mb-6">
          <Progress 
            percent={uploadProgress} 
            status="active"
            strokeColor={{
              '0%': '#87d068',
              '100%': '#52c41a',
            }}
          />
          <Text className="block mt-2">Đang upload minh chứng...</Text>
        </div>
      )}

      <Upload.Dragger
        accept="image/*"
        showUploadList={false}
        beforeUpload={handleUpload}
        disabled={uploading}
        className="mb-6"
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined className="text-4xl text-blue-500" />
        </p>
        <p className="ant-upload-text">
          Kéo thả ảnh vào đây hoặc click để chọn file
        </p>
        <p className="ant-upload-hint">
          Hỗ trợ định dạng: JPG, PNG, JPEG (tối đa 5MB)
        </p>
      </Upload.Dragger>

      <Alert
        message="Yêu cầu về ảnh minh chứng"
        description={
          <ul className="mt-2 space-y-1 text-left">
            <li>• Ảnh rõ nét, không bị mờ hoặc che khuất</li>
            <li>• Hiển thị đầy đủ thông tin giao dịch</li>
            <li>• Bao gồm: số tiền, nội dung, thời gian giao dịch</li>
            <li>• Trạng thái giao dịch phải là "Thành công"</li>
          </ul>
        }
        type="info"
        showIcon
        className="text-left"
      />
    </Card>
  );

  // Render completion section
  const renderCompletion = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"
          >
            <CheckCircleOutlined className="text-4xl text-white" />
          </motion.div>
          <Title level={2} className="text-green-600 dark:text-green-400">
            Upload thành công!
          </Title>
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            Minh chứng thanh toán đã được gửi thành công
          </Text>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <Title level={4} className="mb-4">Thông tin đơn hàng</Title>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Text>Mã đơn hàng:</Text>
              <Text strong>{orderNumber}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Phương thức thanh toán:</Text>
              <Tag color={paymentMethods[selectedMethod!].color}>
                {paymentMethods[selectedMethod!].name}
              </Tag>
            </div>
            <div className="flex justify-between">
              <Text>Tổng tiền:</Text>
              <Text strong className="text-red-500">{formatVND(totalAmount)}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Trạng thái:</Text>
              <Tag color="orange" icon={<ClockCircleOutlined />}>
                Chờ xác nhận thanh toán
              </Tag>
            </div>
          </div>
        </div>

        <Alert
          message="Tiếp theo làm gì?"
          description={
            <div className="text-left mt-2">
              <p>✅ Đơn hàng đang được xử lý</p>
              <p>✅ Minh chứng thanh toán đang được kiểm tra</p>
              <p>⏳ Thời gian xác nhận: 5-15 phút trong giờ hành chính</p>
              <p>📧 Bạn sẽ nhận được email xác nhận khi thanh toán được duyệt</p>
            </div>
          }
          type="success"
          showIcon
          className="mb-6 text-left"
        />

        <Space className="w-full" direction="vertical" size="large">
          <Button 
            type="primary" 
            size="large"
            onClick={onComplete}
            className="w-full"
          >
            Xem chi tiết đơn hàng
          </Button>
          <Button size="large" className="w-full">
            Tiếp tục mua sắm
          </Button>
        </Space>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <Card className="mb-8">
        <Steps current={currentStep} className="mb-6">
          <Step 
            title="Chọn phương thức" 
            icon={<DollarOutlined />}
            description="Chọn cách thanh toán"
          />
          <Step 
            title="Thực hiện thanh toán" 
            icon={<QrcodeOutlined />}
            description="Quét QR hoặc chuyển khoản"
          />
          <Step 
            title="Upload minh chứng" 
            icon={<UploadOutlined />}
            description="Tải lên ảnh xác nhận"
          />
          <Step 
            title="Hoàn thành" 
            icon={<CheckCircleOutlined />}
            description="Chờ xác nhận"
          />
        </Steps>
      </Card>

      {/* Content based on current step */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="methods"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <div className="text-center mb-6">
                <Title level={3}>Chọn phương thức thanh toán</Title>
                <Text className="text-gray-600 dark:text-gray-400">
                  Vui lòng chọn phương thức thanh toán phù hợp
                </Text>
              </div>
              {renderPaymentMethods()}
            </Card>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderPaymentInstructions()}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderUploadSection()}
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderCompletion()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="80%"
        style={{ maxWidth: 800 }}
      >
        {previewImage && (
          <Image
            src={previewImage}
            alt="Payment proof preview"
            className="w-full"
          />
        )}
      </Modal>
    </div>
  );
};

export default PaymentUploadComponent;