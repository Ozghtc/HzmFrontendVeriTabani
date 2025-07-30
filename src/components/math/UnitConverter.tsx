import React, { useState } from 'react';
import { ArrowLeftRight, Calculator as CalcIcon, RefreshCw } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const [conversionType, setConversionType] = useState<string>('temperature');
  const [value, setValue] = useState<string>('100');
  const [fromUnit, setFromUnit] = useState<string>('C');
  const [toUnit, setToUnit] = useState<string>('F');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const conversionTypes = {
    temperature: {
      label: 'Sıcaklık',
      units: [
        { value: 'C', label: '°C (Celsius)' },
        { value: 'F', label: '°F (Fahrenheit)' },
        { value: 'K', label: 'K (Kelvin)' }
      ]
    },
    length: {
      label: 'Uzunluk',
      units: [
        { value: 'm', label: 'Metre (m)' },
        { value: 'cm', label: 'Santimetre (cm)' },
        { value: 'mm', label: 'Milimetre (mm)' },
        { value: 'km', label: 'Kilometre (km)' },
        { value: 'ft', label: 'Fit (ft)' },
        { value: 'in', label: 'İnç (in)' }
      ]
    },
    mass: {
      label: 'Ağırlık',
      units: [
        { value: 'kg', label: 'Kilogram (kg)' },
        { value: 'g', label: 'Gram (g)' },
        { value: 'mg', label: 'Miligram (mg)' },
        { value: 'lb', label: 'Pound (lb)' },
        { value: 'oz', label: 'Ons (oz)' }
      ]
    }
  };

  const currentType = conversionTypes[conversionType as keyof typeof conversionTypes];

  const handleTypeChange = (newType: string) => {
    setConversionType(newType);
    const type = conversionTypes[newType as keyof typeof conversionTypes];
    if (type && type.units.length >= 2) {
      setFromUnit(type.units[0].value);
      setToUnit(type.units[1].value);
    }
    setResult(null);
    setError('');
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  };

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        throw new Error('Geçerli bir sayı girin');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://hzmbackendveritabani-production.up.railway.app'}/api/v1/math/science`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'hzm_2943236d983b4588a30987b4cf96dfbe',
          'X-User-Email': 'test@example.com',
          'X-Project-Password': 'test123456'
        },
        body: JSON.stringify({
          operation: 'unit_conversion',
          data: {
            value: numValue,
            fromUnit,
            toUnit,
            type: conversionType
          }
        })
      });

      const responseData = await response.json();

      if (responseData.success) {
        setResult(responseData.data);
      } else {
        setError(responseData.error || 'Dönüştürme hatası oluştu');
      }
    } catch (err: any) {
      setError(err.message || 'Sunucu bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const fromUnitLabel = currentType.units.find(u => u.value === fromUnit)?.label || fromUnit;
    const toUnitLabel = currentType.units.find(u => u.value === toUnit)?.label || toUnit;

    return (
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Dönüştürme Sonucu</h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">
              {result.result.convertedValue.toFixed(4)}
            </div>
            <div className="text-sm text-green-600">
              {result.result.calculation}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {result.result.originalValue}
                </div>
                <div className="text-sm text-gray-600">{fromUnitLabel}</div>
              </div>
              
              <div className="text-center">
                <ArrowLeftRight className="mx-auto text-gray-400" size={20} />
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {result.result.convertedValue.toFixed(4)}
                </div>
                <div className="text-sm text-gray-600">{toUnitLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ArrowLeftRight className="text-orange-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Birim Dönüştürücü</h2>
        </div>
        <p className="text-gray-600">Sıcaklık, uzunluk ve ağırlık birimlerini dönüştürün</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Birim Dönüştürme</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dönüştürme Türü
              </label>
              <select
                value={conversionType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.entries(conversionTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Değer
              </label>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaynak Birim
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {currentType.units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Birim
                </label>
                <div className="flex gap-2">
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {currentType.units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={swapUnits}
                    className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Birimleri değiştir"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <ArrowLeftRight className="animate-pulse" size={20} />
                  Dönüştürülüyor...
                </>
              ) : (
                <>
                  <CalcIcon size={20} />
                  Dönüştür
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

export default UnitConverter; 