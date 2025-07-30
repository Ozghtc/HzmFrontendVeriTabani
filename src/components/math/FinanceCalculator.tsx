import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const FinanceCalculator: React.FC = () => {
  const [operation, setOperation] = useState<string>('simple_interest');
  const [inputs, setInputs] = useState<{[key: string]: string}>({
    principal: '10000',
    rate: '0.05',
    time: '2'
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const operations = [
    { 
      value: 'simple_interest', 
      label: 'Basit Faiz', 
      description: 'I = P × r × t',
      fields: [
        { key: 'principal', label: 'Ana Para (₺)', type: 'number' },
        { key: 'rate', label: 'Faiz Oranı (ondalık)', type: 'number', step: '0.01' },
        { key: 'time', label: 'Süre (yıl)', type: 'number' }
      ]
    },
    { 
      value: 'compound_interest', 
      label: 'Bileşik Faiz', 
      description: 'A = P(1 + r/n)^(nt)',
      fields: [
        { key: 'principalComp', label: 'Ana Para (₺)', type: 'number' },
        { key: 'rateComp', label: 'Faiz Oranı (ondalık)', type: 'number', step: '0.01' },
        { key: 'timeComp', label: 'Süre (yıl)', type: 'number' },
        { key: 'compoundFreq', label: 'Birleşim Sıklığı (yılda)', type: 'number' }
      ]
    },
    { 
      value: 'loan_payment', 
      label: 'Kredi Ödemesi', 
      description: 'PMT = PV × [r(1+r)^n] / [(1+r)^n - 1]',
      fields: [
        { key: 'loanAmount', label: 'Kredi Tutarı (₺)', type: 'number' },
        { key: 'loanRate', label: 'Aylık Faiz Oranı', type: 'number', step: '0.001' },
        { key: 'loanTerms', label: 'Ödeme Sayısı (ay)', type: 'number' }
      ]
    },
    { 
      value: 'roi', 
      label: 'Yatırım Getirisi (ROI)', 
      description: 'ROI = (Final - Initial) / Initial × 100',
      fields: [
        { key: 'initialInvestment', label: 'İlk Yatırım (₺)', type: 'number' },
        { key: 'finalValue', label: 'Final Değer (₺)', type: 'number' },
        { key: 'timeInvested', label: 'Yatırım Süresi (yıl)', type: 'number' }
      ]
    }
  ];

  const currentOp = operations.find(op => op.value === operation);

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data: {[key: string]: number} = {};
      
      currentOp?.fields.forEach(field => {
        const value = parseFloat(inputs[field.key] || '0');
        if (isNaN(value)) {
          throw new Error(`${field.label} geçerli bir sayı olmalı`);
        }
        data[field.key] = value;
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://hzmbackendveritabani-production.up.railway.app'}/api/v1/math/finance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'hzm_2943236d983b4588a30987b4cf96dfbe',
          'X-User-Email': 'test@example.com',
          'X-Project-Password': 'test123456'
        },
        body: JSON.stringify({
          operation,
          data
        })
      });

      const responseData = await response.json();

      if (responseData.success) {
        setResult(responseData.data);
      } else {
        setError(responseData.error || 'Hesaplama hatası oluştu');
      }
    } catch (err: any) {
      setError(err.message || 'Sunucu bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Sonuç</h3>
        <div className="space-y-3">
          <div className="text-sm text-green-600">{result.description}</div>
          
          <div className="space-y-2">
            {Object.entries(result.result).map(([key, value]) => {
              if (key === 'formula' || key === 'calculation') return null;
              
              return (
                <div key={key} className="flex justify-between items-center bg-white p-3 rounded border">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="font-bold text-gray-800">
                    {typeof value === 'number' ? 
                      (key.includes('Rate') || key.includes('Percentage') ? 
                        (typeof value === 'string' ? value : `${(value * 100).toFixed(2)}%`) :
                        value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
                      ) : 
                      String(value)
                    }
                  </span>
                </div>
              );
            })}
          </div>

          {result.result.formula && (
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="text-sm text-blue-600">Formül:</div>
              <div className="font-mono text-blue-800">{result.result.formula}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <DollarSign className="text-green-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Finansal Matematik</h2>
        </div>
        <p className="text-gray-600">Faiz, kredi ve yatırım hesaplamaları</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Finansal Hesaplama</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hesaplama Türü
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {operations.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">{currentOp?.description}</p>
            </div>

            {currentOp?.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  step={field.step}
                  value={inputs[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ))}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <TrendingUp className="animate-pulse" size={20} />
                  Hesaplanıyor...
                </>
              ) : (
                <>
                  <CalcIcon size={20} />
                  Hesapla
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <strong>Hata:</strong> {error}
            </div>
          )}
          {renderResult()}
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator; 