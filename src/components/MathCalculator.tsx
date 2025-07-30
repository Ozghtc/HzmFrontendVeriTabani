import React, { useState } from 'react';
import { Calculator, Plus, Minus, X, Divide, Percent, Square, CheckCircle } from 'lucide-react';

interface MathOperation {
  operation: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const MathCalculator: React.FC = () => {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const operations: MathOperation[] = [
    { operation: 'add', label: 'Toplama', icon: <Plus size={16} />, description: 'İki sayıyı toplar' },
    { operation: 'subtract', label: 'Çıkarma', icon: <Minus size={16} />, description: 'İlk sayıdan ikinci sayıyı çıkarır' },
    { operation: 'multiply', label: 'Çarpma', icon: <X size={16} />, description: 'İki sayıyı çarpar' },
    { operation: 'divide', label: 'Bölme', icon: <Divide size={16} />, description: 'İlk sayıyı ikinci sayıya böler' },
    { operation: 'modulo', label: 'Mod', icon: <Percent size={16} />, description: 'Bölme işleminin kalanını bulur' },
    { operation: 'power', label: 'Üs', icon: <Square size={16} />, description: 'İlk sayının ikinci sayı kadar üssünü alır' }
  ];

  const handleCalculate = async () => {
    if (!num1 || !num2) {
      setError('Lütfen her iki sayıyı da girin');
      return;
    }

    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
      setError('Lütfen geçerli sayılar girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://rare-courage-production.up.railway.app/api/v1/math/basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'hzm_1ce98c92189d4a109cd604b22bfd86b7',
          'X-User-Email': 'ozgurhzm@gmail.com',
          'X-Project-Password': 'test123456'
        },
        body: JSON.stringify({
          operation,
          num1: number1,
          num2: number2
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Hesaplama hatası oluştu');
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNum1('');
    setNum2('');
    setResult(null);
    setError('');
    setOperation('add');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Matematik Hesaplayıcı</h2>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İlk Sayı
          </label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İkinci Sayı
          </label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 25"
          />
        </div>
      </div>

      {/* Operation Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          İşlem Seçin
        </label>
        <div className="grid grid-cols-2 gap-2">
          {operations.map((op) => (
            <button
              key={op.operation}
              onClick={() => setOperation(op.operation)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                operation === op.operation
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              title={op.description}
            >
              <div className="flex items-center gap-2">
                {op.icon}
                <span className="text-sm font-medium">{op.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Hesaplanıyor...' : 'Hesapla'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Temizle
        </button>
      </div>

      {/* Result */}
      {result !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm font-medium text-green-800">Sonuç:</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mt-2">
            {result.toLocaleString('tr-TR')}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-800">
            <strong>Hata:</strong> {error}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        HZMSoft Matematik API'si kullanılarak hesaplanmaktadır
      </div>
    </div>
  );
};

export default MathCalculator; 