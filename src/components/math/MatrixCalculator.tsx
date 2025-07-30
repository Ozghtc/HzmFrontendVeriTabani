import React, { useState } from 'react';
import { Grid3X3, Plus, X, Calculator as CalcIcon, Trash2, RotateCcw } from 'lucide-react';

interface MatrixOperation {
  operation: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  requiresTwoMatrices: boolean;
}

const MatrixCalculator: React.FC = () => {
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [operation, setOperation] = useState<string>('matrix_add');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const operations: MatrixOperation[] = [
    {
      operation: 'matrix_add',
      label: 'Matrix Toplama',
      icon: <Plus size={16} />,
      description: 'İki matrisi toplar (aynı boyutta olmalı)',
      requiresTwoMatrices: true
    },
    {
      operation: 'matrix_multiply',
      label: 'Matrix Çarpma',
      icon: <X size={16} />,
      description: 'İki matrisi çarpar (A\'nın sütunu = B\'nin satırı)',
      requiresTwoMatrices: true
    },
    {
      operation: 'matrix_determinant',
      label: 'Determinant',
      icon: <CalcIcon size={16} />,
      description: 'Kare matrisin determinantını hesaplar (2x2 veya 3x3)',
      requiresTwoMatrices: false
    }
  ];

  const updateMatrixCell = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (matrix === 'A') {
      const newMatrix = [...matrixA];
      newMatrix[row][col] = numValue;
      setMatrixA(newMatrix);
    } else {
      const newMatrix = [...matrixB];
      newMatrix[row][col] = numValue;
      setMatrixB(newMatrix);
    }
  };

  const addRow = (matrix: 'A' | 'B') => {
    if (matrix === 'A') {
      const newRow = new Array(matrixA[0].length).fill(0);
      setMatrixA([...matrixA, newRow]);
    } else {
      const newRow = new Array(matrixB[0].length).fill(0);
      setMatrixB([...matrixB, newRow]);
    }
  };

  const addColumn = (matrix: 'A' | 'B') => {
    if (matrix === 'A') {
      const newMatrix = matrixA.map(row => [...row, 0]);
      setMatrixA(newMatrix);
    } else {
      const newMatrix = matrixB.map(row => [...row, 0]);
      setMatrixB(newMatrix);
    }
  };

  const clearMatrix = (matrix: 'A' | 'B') => {
    if (matrix === 'A') {
      setMatrixA([[0, 0], [0, 0]]);
    } else {
      setMatrixB([[0, 0], [0, 0]]);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let requestData: any = {
        operation,
        data: {}
      };

      // Prepare data based on operation
      switch (operation) {
        case 'matrix_add':
          requestData.data = { matrixA, matrixB };
          break;
        case 'matrix_multiply':
          requestData.data = { matrixX: matrixA, matrixY: matrixB };
          break;
        case 'matrix_determinant':
          requestData.data = { matrix: matrixA };
          break;
        default:
          throw new Error('Desteklenmeyen işlem');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://hzmbackendveritabani-production.up.railway.app'}/api/v1/math/science`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'hzm_2943236d983b4588a30987b4cf96dfbe',
          'X-User-Email': 'test@example.com',
          'X-Project-Password': 'test123456'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data.result);
      } else {
        setError(data.error || 'Hesaplama hatası oluştu');
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const renderMatrix = (matrix: number[][], label: string, matrixId: 'A' | 'B') => (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Matrix {label}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => addRow(matrixId)}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
          >
            +Satır
          </button>
          <button
            onClick={() => addColumn(matrixId)}
            className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
          >
            +Sütun
          </button>
          <button
            onClick={() => clearMatrix(matrixId)}
            className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))` }}>
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={cell}
              onChange={(e) => updateMatrixCell(matrixId, rowIndex, colIndex, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          ))
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Boyut: {matrix.length}×{matrix[0].length}
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Sonuç</h3>
        
        {operation === 'matrix_determinant' ? (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-700">
              det(A) = {result.determinant}
            </div>
            <div className="text-sm text-green-600">
              {result.isSingular ? 'Matrix tekil (singular)' : 'Matrix tekil değil'}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm text-green-600 mb-2">
              {result.operation} - {result.dimensions}
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${result.result[0].length}, minmax(0, 1fr))` }}>
              {result.result.map((row: number[], rowIndex: number) =>
                row.map((cell: number, colIndex: number) => (
                  <div
                    key={`result-${rowIndex}-${colIndex}`}
                    className="p-3 bg-white border border-green-200 rounded text-center font-mono"
                  >
                    {typeof cell === 'number' ? cell.toFixed(2) : cell}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedOperation = operations.find(op => op.operation === operation);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Grid3X3 className="text-blue-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Matrix İşlemleri</h2>
        </div>
        <p className="text-gray-600">
          Matrix toplama, çarpma ve determinant hesaplamaları
        </p>
      </div>

      {/* Operation Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">İşlem Seçin</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {operations.map((op) => (
            <label
              key={op.operation}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                operation === op.operation
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name="operation"
                value={op.operation}
                checked={operation === op.operation}
                onChange={(e) => setOperation(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${operation === op.operation ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {op.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{op.label}</div>
                  <div className="text-sm text-gray-600">{op.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Matrix Inputs */}
      <div className={`grid gap-8 ${selectedOperation?.requiresTwoMatrices ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md mx-auto'}`}>
        {renderMatrix(matrixA, 'A', 'A')}
        {selectedOperation?.requiresTwoMatrices && renderMatrix(matrixB, 'B', 'B')}
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-3"
        >
          {loading ? (
            <>
              <RotateCcw className="animate-spin" size={20} />
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Hata:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {renderResult()}
    </div>
  );
};

export default MatrixCalculator; 