import React, { useState } from 'react';
import { X, Clock, Calendar, Plus, Save } from 'lucide-react';

interface PersonnelRequestFormProps {
  onClose: () => void;
  onSubmit: (requests: RequestItem[]) => void;
}

interface RequestItem {
  id: string;
  type: 'duty' | 'leave';
  date: string;
  endDate?: string;
  field: string;
  description: string;
  isDateRange: boolean;
}

const PersonnelRequestForm: React.FC<PersonnelRequestFormProps> = ({ onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState<'duty' | 'leave' | null>(null);
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [field, setField] = useState('');
  const [description, setDescription] = useState('');
  const [isDateRange, setIsDateRange] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  // Handle type selection with mutual exclusivity
  const handleTypeSelect = (type: 'duty' | 'leave') => {
    if (selectedType === type) {
      // If clicking the same type, deselect it
      setSelectedType(null);
    } else {
      // If clicking a different type, select it (this will deselect the other)
      setSelectedType(type);
    }
  };

  const handleAddRequest = () => {
    if (!selectedType || !date || !field) return;

    const newRequest: RequestItem = {
      id: Date.now().toString(),
      type: selectedType,
      date,
      endDate: isDateRange ? endDate : undefined,
      field,
      description,
      isDateRange
    };

    setRequests([...requests, newRequest]);
    
    // Reset form
    setDate('');
    setEndDate('');
    setField('');
    setDescription('');
    setIsDateRange(false);
  };

  const handleRemoveRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleSubmit = () => {
    onSubmit(requests);
    onClose();
  };

  const getTypeLabel = (type: 'duty' | 'leave') => {
    return type === 'duty' ? 'Nöbet İsteği' : 'İzin/Boşluk Talebi';
  };

  const getTypeIcon = (type: 'duty' | 'leave') => {
    return type === 'duty' ? <Clock size={16} /> : <Calendar size={16} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Personel Talebi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Request Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedType === 'duty'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleTypeSelect('duty')}
          >
            <div className="flex items-center mb-2">
              <Clock size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">Nöbet İsteği</span>
            </div>
            <p className="text-sm text-gray-600">Nöbet değişimi veya nöbet talebi</p>
          </div>

          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedType === 'leave'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleTypeSelect('leave')}
          >
            <div className="flex items-center mb-2">
              <Calendar size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">İzin/Boşluk Talebi</span>
            </div>
            <p className="text-sm text-gray-600">İzin veya boşluk talebi</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih *
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tarih seçin"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dateRange"
                  checked={isDateRange}
                  onChange={(e) => {
                    setIsDateRange(e.target.checked);
                    if (!e.target.checked) {
                      setEndDate(''); // Clear end date when unchecking
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="dateRange" className="ml-2 text-sm text-gray-700">
                  Tarih aralığı
                </label>
              </div>
            </div>
            {isDateRange && (
              <div className="mt-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bitiş tarihi seçin"
                  min={date} // Ensure end date is not before start date
                />
              </div>
            )}
          </div>

          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alan *
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alan seçin</option>
              <option value="CERRAHİ">CERRAHİ</option>
              <option value="DAHİLİYE">DAHİLİYE</option>
              <option value="PEDİATRİ">PEDİATRİ</option>
              <option value="ACİL">ACİL</option>
              <option value="YOĞUN BAKIM">YOĞUN BAKIM</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Açıklama ekleyin (opsiyonel)"
            />
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddRequest}
              disabled={!selectedType || !date || !field}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={16} className="mr-1" />
              Ekle
            </button>
          </div>
        </div>

        {/* Added Requests */}
        {requests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Eklenen Talepler</h3>
            <div className="space-y-2">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center">
                    {getTypeIcon(request.type)}
                    <span className="ml-2 font-medium">
                      {getTypeLabel(request.type)}
                    </span>
                    <span className="ml-2 text-gray-600">
                      • {request.date}
                      {request.isDateRange && request.endDate && ` - ${request.endDate}`}
                      • {request.field}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveRequest(request.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Toplam {requests.length} talep
            </p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={requests.length === 0}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Save size={16} className="mr-1" />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonnelRequestForm; 