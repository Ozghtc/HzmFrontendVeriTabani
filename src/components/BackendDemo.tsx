import React, { useState, useEffect } from 'react';
import { useBackend } from '../context/BackendContext';
import { Alert, Button, Card, CardContent, CircularProgress, Box, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const BackendDemo: React.FC = () => {
  const {
    projects,
    selectedProject,
    selectedTable,
    isLoading,
    error,
    createProject,
    loadProjectInfo,
    createTable,
    loadTableData,
    createData,
    selectProject,
    selectTable,
    checkHealth,
    clearError
  } = useBackend();

  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('vt_test123demo456789');
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    // Health check on component mount
    handleHealthCheck();
  }, []);

  const handleHealthCheck = async () => {
    try {
      const health = await checkHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      const project = await createProject(newProjectName, newProjectDesc);
      setCreateProjectDialogOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      console.log('Project created:', project);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleLoadProject = async () => {
    if (!apiKeyInput.trim()) return;
    
    try {
      const project = await loadProjectInfo(apiKeyInput);
      selectProject(project);
      console.log('Project loaded:', project);
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const handleCreateTable = async () => {
    if (!selectedProject) return;
    
    try {
      const table = await createTable(selectedProject.apiKey, {
        name: 'demo_users',
        displayName: 'Demo Users',
        description: 'Test tablosu',
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'email', type: 'text', required: true },
          { name: 'age', type: 'number' },
          { name: 'is_active', type: 'boolean' }
        ]
      });
      selectTable(table);
      console.log('Table created:', table);
    } catch (error) {
      console.error('Failed to create table:', error);
    }
  };

  const handleLoadTableData = async () => {
    if (!selectedProject || !selectedTable) return;
    
    try {
      const result = await loadTableData(selectedProject.apiKey, selectedTable.name);
      setTableData(result.data);
      console.log('Table data loaded:', result);
    } catch (error) {
      console.error('Failed to load table data:', error);
    }
  };

  const handleCreateData = async () => {
    if (!selectedProject || !selectedTable) return;
    
    try {
      const newData = await createData(selectedProject.apiKey, selectedTable.name, {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        is_active: true
      });
      
      // Refresh table data
      handleLoadTableData();
      console.log('Data created:', newData);
    } catch (error) {
      console.error('Failed to create data:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🔗 Backend Entegrasyonu Demo
      </Typography>

      {/* Health Status */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Backend Durumu</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" onClick={handleHealthCheck}>
              Sağlık Kontrolü
            </Button>
            {healthStatus && (
              <Alert severity={healthStatus.status === 'healthy' ? 'success' : 'error'}>
                Status: {healthStatus.status} - Database: {healthStatus.database || 'Unknown'}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CircularProgress size={20} />
          <Typography>Yükleniyor...</Typography>
        </Box>
      )}

      {/* Projects Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Projeler</Typography>
          
          <Box display="flex" gap={2} mb={2}>
            <Button 
              variant="contained" 
              onClick={() => setCreateProjectDialogOpen(true)}
              disabled={isLoading}
            >
              Yeni Proje Oluştur
            </Button>
            
            <TextField
              placeholder="API Key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              size="small"
            />
            <Button 
              variant="outlined" 
              onClick={handleLoadProject}
              disabled={isLoading || !apiKeyInput.trim()}
            >
              Proje Yükle
            </Button>
          </Box>

          {projects.length > 0 && (
            <Box>
              <Typography variant="subtitle2">Yüklenen Projeler:</Typography>
              {projects.map(project => (
                <Card key={project.apiKey} variant="outlined" sx={{ mt: 1, p: 1 }}>
                  <Typography variant="body2">
                    <strong>{project.name}</strong> - API Key: {project.apiKey}
                  </Typography>
                  <Typography variant="caption">
                    Tablolar: {project.tables?.length || 0} - 
                    Kayıtlar: {project.stats?.totalRecords || 0}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Selected Project Info */}
      {selectedProject && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Seçili Proje</Typography>
            <Typography><strong>Adı:</strong> {selectedProject.name}</Typography>
            <Typography><strong>API Key:</strong> {selectedProject.apiKey}</Typography>
            <Typography><strong>Tablo Sayısı:</strong> {selectedProject.tables?.length || 0}</Typography>
            
            <Box mt={2}>
              <Button 
                variant="contained" 
                onClick={handleCreateTable}
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                Demo Tablo Oluştur
              </Button>
            </Box>

            {selectedProject.tables && selectedProject.tables.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2">Tablolar:</Typography>
                {selectedProject.tables.map(table => (
                  <Button
                    key={table.name}
                    variant={selectedTable?.name === table.name ? "contained" : "outlined"}
                    onClick={() => selectTable(table)}
                    sx={{ mr: 1, mt: 1 }}
                  >
                    {table.displayName} ({table.fields.length} alan)
                  </Button>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Table Data */}
      {selectedTable && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tablo: {selectedTable.displayName}
            </Typography>
            
            <Box display="flex" gap={2} mb={2}>
              <Button 
                variant="contained" 
                onClick={handleLoadTableData}
                disabled={isLoading}
              >
                Verileri Yükle
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleCreateData}
                disabled={isLoading}
              >
                Test Verisi Ekle
              </Button>
            </Box>

            <Typography variant="subtitle2">Alanlar:</Typography>
            <Box display="flex" gap={1} mb={2}>
              {selectedTable.fields.map(field => (
                <Box key={field.name} sx={{ 
                  border: 1, 
                  borderColor: 'grey.300', 
                  borderRadius: 1, 
                  p: 1 
                }}>
                  <Typography variant="caption">
                    {field.name} ({field.type}) {field.required ? '*' : ''}
                  </Typography>
                </Box>
              ))}
            </Box>

            {tableData.length > 0 && (
              <Box>
                <Typography variant="subtitle2">Veriler ({tableData.length} kayıt):</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {tableData.map((row, index) => (
                    <Card key={row.id || index} variant="outlined" sx={{ mt: 1, p: 1 }}>
                      <pre style={{ fontSize: '12px', margin: 0 }}>
                        {JSON.stringify(row, null, 2)}
                      </pre>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Project Dialog */}
      <Dialog open={createProjectDialogOpen} onClose={() => setCreateProjectDialogOpen(false)}>
        <DialogTitle>Yeni Proje Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Proje Adı"
            fullWidth
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Açıklama (opsiyonel)"
            fullWidth
            multiline
            rows={2}
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateProjectDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleCreateProject}
            disabled={!newProjectName.trim() || isLoading}
            variant="contained"
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackendDemo; 