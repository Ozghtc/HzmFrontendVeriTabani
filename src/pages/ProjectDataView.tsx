import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { ArrowLeft, Table, Pencil, Trash2, Check, X } from 'lucide-react';

const ProjectDataView = () => {
  const { projectId, userId } = useParams();
  const navigate = useNavigate();
  const { state } = useDatabase();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState<{ [key: string]: any }>({});
  const [tableData, setTableData] = useState<{ [tableId: string]: any[] }>(() => {
    const saved = localStorage.getItem('tableData');
    return saved ? JSON.parse(saved) : {};
  });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<{ [key: string]: any }>({});
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const project = state.projects.find(p => p.id === projectId);
  const currentTable = project?.tables.find(t => t.id === selectedTable);

  const handleSaveRow = () => {
    if (!selectedTable) return;
    const updated = {
      ...tableData,
      [selectedTable]: [...(tableData[selectedTable] || []), newRow],
    };
    setTableData(updated);
    localStorage.setItem('tableData', JSON.stringify(updated));
    setAddingRow(false);
  };

  const handleDeleteRow = (idx: number) => {
    setDeleteIdx(idx);
  };

  const confirmDeleteRow = () => {
    if (!selectedTable || deleteIdx === null) return;
    const updated = {
      ...tableData,
      [selectedTable]: tableData[selectedTable].filter((_: any, i: number) => i !== deleteIdx),
    };
    setTableData(updated);
    localStorage.setItem('tableData', JSON.stringify(updated));
    setDeleteIdx(null);
  };

  const cancelDeleteRow = () => {
    setDeleteIdx(null);
  };

  const handleEditRow = (idx: number) => {
    setEditIdx(idx);
    setEditRow({ ...tableData[selectedTable!][idx] });
  };

  const saveEditRow = () => {
    if (!selectedTable || editIdx === null) return;
    const updatedRows = [...tableData[selectedTable]];
    updatedRows[editIdx] = editRow;
    const updated = {
      ...tableData,
      [selectedTable]: updatedRows,
    };
    setTableData(updated);
    localStorage.setItem('tableData', JSON.stringify(updated));
    setEditIdx(null);
    setEditRow({});
  };

  const cancelEditRow = () => {
    setEditIdx(null);
    setEditRow({});
  };

  if (!project) {
    return <div>Proje bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate(`/projects/user/${userId}`)}
            className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{project.name} - Veriler</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex gap-6 justify-start">
          {/* Tablolar Listesi */}
          <div className="w-64 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <Table size={20} className="mr-2" />
              Tablolar
            </h2>
            <div className="space-y-2">
              {project.tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedTable === table.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {table.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tablo İçeriği */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4" style={{ marginRight: '80px' }}>
            {!selectedTable ? (
              <div className="text-center text-gray-500 py-8">
                Lütfen görüntülemek istediğiniz tabloyu seçin
              </div>
            ) : !currentTable ? (
              <div className="text-center text-gray-500 py-8">
                Tablo bulunamadı
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex justify-end mb-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                    onClick={() => {
                      setAddingRow(true);
                      setNewRow({});
                    }}
                  >
                    + Veri Ekle
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {currentTable.fields.map(field => (
                        <th
                          key={field.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {field.name}
                        </th>
                      ))}
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {addingRow && (
                      <tr>
                        {currentTable.fields.map(field => (
                          <td key={field.id} className="px-6 py-2">
                            <input
                              type="text"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={newRow[field.id] || ''}
                              onChange={e => setNewRow({ ...newRow, [field.id]: e.target.value })}
                            />
                          </td>
                        ))}
                        <td className="px-6 py-2 flex gap-2">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            onClick={handleSaveRow}
                          >Kaydet</button>
                          <button
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400"
                            onClick={() => setAddingRow(false)}
                          >İptal</button>
                        </td>
                      </tr>
                    )}
                    {(tableData[selectedTable] || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={currentTable.fields.length + 1}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          Henüz veri girilmemiş
                        </td>
                      </tr>
                    ) : (
                      (tableData[selectedTable] || []).map((row, idx) => (
                        <tr key={idx}>
                          {editIdx === idx ? (
                            <>
                              {currentTable.fields.map(field => (
                                <td key={field.id} className="px-6 py-2">
                                  <textarea
                                    className="w-full min-w-[200px] max-w-full min-h-[32px] max-h-[120px] border rounded px-2 py-1 text-sm resize overflow-auto"
                                    value={editRow[field.id] || ''}
                                    onChange={e => setEditRow({ ...editRow, [field.id]: e.target.value })}
                                    rows={2}
                                    wrap="soft"
                                  />
                                </td>
                              ))}
                              <td className="px-6 py-2 flex gap-2">
                                <button
                                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center"
                                  onClick={saveEditRow}
                                  title="Kaydet"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500 flex items-center"
                                  onClick={cancelEditRow}
                                  title="İptal"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              {currentTable.fields.map(field => (
                                <td key={field.id} className="px-6 py-2 align-top">
                                  <div
                                    className="max-h-[60px] overflow-y-auto whitespace-pre-line break-words"
                                    style={{ minHeight: '32px', lineHeight: '1.2', maxHeight: '60px' }}
                                  >
                                    {row[field.id]}
                                  </div>
                                </td>
                              ))}
                              <td className="px-6 py-2 flex gap-2">
                                <button
                                  className="bg-yellow-400 text-white px-2 py-1 rounded text-xs hover:bg-yellow-500 flex items-center"
                                  title="Düzenle"
                                  onClick={() => handleEditRow(idx)}
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center"
                                  onClick={() => handleDeleteRow(idx)}
                                  title="Sil"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Silme onay popup'ı */}
                {deleteIdx !== null && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
                      <div className="mb-4 text-lg font-semibold">Emin misiniz?</div>
                      <div className="mb-6 text-gray-600 text-sm">Bu veriyi silmek istediğinize emin misiniz?</div>
                      <div className="flex justify-center gap-4">
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          onClick={confirmDeleteRow}
                        >Evet, Sil</button>
                        <button
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                          onClick={cancelDeleteRow}
                        >İptal</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Sağda boşluk */}
          <div style={{ width: '32px' }}></div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDataView;