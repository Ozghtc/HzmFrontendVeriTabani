import React, { useState } from 'react';
import { Atom, Calculator as CalcIcon, Zap } from 'lucide-react';

const ScienceCalculator: React.FC = () => {
  const [operation, setOperation] = useState<string>('chemistry_ph');
  const [inputs, setInputs] = useState<{[key: string]: string}>({
    hConcentration: '0.001'
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const operations = [
    {
      category: 'Kimya',
      items: [
        { 
          value: 'chemistry_ph', 
          label: 'pH Hesaplama', 
          description: 'pH = -log₁₀[H⁺]',
          fields: [
            { key: 'hConcentration', label: 'H⁺ Konsantrasyonu (mol/L)', type: 'number', step: '0.0001' }
          ]
        },
        { 
          value: 'chemistry_molarity', 
          label: 'Molarite', 
          description: 'M = n / V',
          fields: [
            { key: 'moles', label: 'Mol Sayısı', type: 'number', step: '0.01' },
            { key: 'volumeLiters', label: 'Hacim (L)', type: 'number', step: '0.1' }
          ]
        },
        { 
          value: 'chemistry_ideal_gas', 
          label: 'İdeal Gaz Yasası', 
          description: 'PV = nRT',
          fields: [
            { key: 'pressure', label: 'Basınç (atm)', type: 'number', step: '0.1' },
            { key: 'volume', label: 'Hacim (L)', type: 'number', step: '0.1' },
            { key: 'temperature', label: 'Sıcaklık (K)', type: 'number', step: '1' }
          ]
        }
      ]
    },
    {
      category: 'Fizik',
      items: [
        { 
          value: 'physics_force', 
          label: 'Kuvvet Hesaplama', 
          description: 'F = ma',
          fields: [
            { key: 'mass', label: 'Kütle (kg)', type: 'number', step: '0.1' },
            { key: 'acceleration', label: 'İvme (m/s²)', type: 'number', step: '0.1' }
          ]
        },
        { 
          value: 'physics_energy', 
          label: 'Kinetik Enerji', 
          description: 'KE = ½mv²',
          fields: [
            { key: 'mass_energy', label: 'Kütle (kg)', type: 'number', step: '0.1' },
            { key: 'velocity', label: 'Hız (m/s)', type: 'number', step: '0.1' }
          ]
        },
        { 
          value: 'physics_wave', 
          label: 'Dalga Hesaplama', 
          description: 'v = fλ',
          fields: [
            { key: 'frequency', label: 'Frekans (Hz)', type: 'number', step: '1' },
            { key: 'wavelength', label: 'Dalga Boyu (m)', type: 'number', step: '0.01' }
          ]
        }
      ]
    }
  ];

  const allOperations = operations.flatMap(cat => cat.items);
  const currentOp = allOperations.find(op => op.value === operation);

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

      const response = await fetch('https://hzmbackendveritabani-production.up.railway.app/api/v1/math/science', {
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
              if (key === 'formula' || key === 'calculation' || key === 'units') return null;
              
              return (
                <div key={key} className="flex justify-between items-center bg-white p-3 rounded border">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="font-bold text-gray-800">
                    {typeof value === 'number' ? 
                      value.toFixed(4) : 
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

          {result.result.calculation && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="text-sm text-yellow-600">Hesaplama:</div>
              <div className="font-mono text-yellow-800">{result.result.calculation}</div>
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
          <Atom className="text-purple-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Bilimsel Hesaplamalar</h2>
        </div>
        <p className="text-gray-600">Kimya ve fizik hesaplamaları</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bilimsel Hesaplama</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hesaplama Türü
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {operations.map((category) => (
                  <optgroup key={category.category} label={category.category}>
                    {category.items.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </optgroup>
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ))}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Zap className="animate-pulse" size={20} />
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

export default ScienceCalculator; 