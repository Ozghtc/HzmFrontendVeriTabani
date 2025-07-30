import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const StatisticsCalculator: React.FC = () => {
  const [data, setData] = useState<string>('10, 20, 30, 40, 50');
  const [operation, setOperation] = useState<string>('mean');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const operations = [
    { value: 'mean', label: 'Ortalama (Mean)', description: 'Aritmetik ortalama' },
    { value: 'median', label: 'Medyan (Median)', description: 'Ortanca değer' },
    { value: 'mode', label: 'Mod (Mode)', description: 'En sık tekrar eden değer' },
    { value: 'stddev', label: 'Standart Sapma', description: 'Verinin yayılımını ölçer' },
    { value: 'variance', label: 'Varyans', description: 'Standart sapmanın karesi' },
    { value: 'quartiles', label: 'Çeyrekler', description: 'Q1, Q2, Q3 değerleri' }
  ];

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const numbers = data.split(',').map(item => parseFloat(item.trim())).filter(num => !isNaN(num));
      
      if (numbers.length === 0) {
        throw new Error('Geçerli sayılar girin');
      }

      const response = await fetch('https://hzmbackendveritabani-production.up.railway.app/api/v1/math/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'hzm_2943236d983b4588a30987b4cf96dfbe',
          'X-User-Email': 'test@example.com',
          'X-Project-Password': 'test123456'
        },
        body: JSON.stringify({
          operation,
          data: numbers
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
          
          {typeof result.result === 'object' && !Array.isArray(result.result) ? (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(result.result).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600">{key.toUpperCase()}</div>
                  <div className="text-lg font-bold text-gray-800">
                    {typeof value === 'number' ? value.toFixed(3) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-2xl font-bold text-green-700">
              {Array.isArray(result.result) 
                ? result.result.join(', ') 
                : typeof result.result === 'number' 
                  ? result.result.toFixed(3)
                  : result.result
              }
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
          <BarChart3 className="text-red-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">İstatistiksel Analiz</h2>
        </div>
        <p className="text-gray-600">Veri setiniz için istatistiksel hesaplamalar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Veri Girişi</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayıları virgülle ayırarak girin
              </label>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                placeholder="örn: 10, 20, 30, 25, 15"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İstatistiksel İşlem
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {operations.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {operations.find(op => op.value === operation)?.description}
              </p>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
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

export default StatisticsCalculator; 