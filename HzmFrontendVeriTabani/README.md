# ⚡ HZM Frontend VeriTabanı

> **React.js + TypeScript** ile geliştirilmiş modern **Backend-as-a-Service (BaaS)** frontend uygulaması

## 🎯 **Özellikler**

### 🎨 **Modern UI/UX**
- Material-UI (MUI) components
- Responsive design için Tailwind CSS
- Dark/Light mode desteği
- Professional admin paneli

### 🔐 **Authentication System**
- Admin panel login sistemi
- Kullanıcı yönetimi
- Role-based access control
- API Key management

### 🗃️ **Database Management**
- Visual tablo oluşturma
- Drag & Drop field management
- 5 farklı alan tipi desteği
- Real-time veri görüntüleme

### 🚀 **Backend Integration**
- RESTful API entegrasyonu
- Real-time backend bağlantısı
- Error handling ve loading states
- Comprehensive API client

### 📱 **Responsive Design**
- Mobile-first approach
- Cross-browser compatibility
- Progressive Web App (PWA) ready

---

## ⚡ **Hızlı Başlangıç**

### **1. Prerequisites**
```bash
# Node.js 18+ gerekli
node --version  # v18.x.x+

# npm veya yarn
npm --version   # v8.x.x+
```

### **2. Kurulum**
```bash
# Repository'yi clone edin
git clone <repository-url>
cd HzmFrontendVeriTabani

# Dependencies yükleyin
npm install

# Environment variables
cp .env.example .env.local
# .env.local dosyasını düzenleyin
```

### **3. Environment Setup**
`.env.local` dosyasını oluşturun:
```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=HZM VeriTabanı
VITE_APP_VERSION=1.0.0

# Development
NODE_ENV=development
```

### **4. Development Server**
```bash
# Development sunucusunu başlatın
npm run dev

# Tarayıcıda açın: http://localhost:5173
```

### **5. Backend Bağlantısı**
Backend sunucusunun çalıştığından emin olun:
```bash
# Backend klasöründe
cd ../HzmBackendVeriTabani
npm start

# Health check
curl http://localhost:3000/health
```

---

## 🏗️ **Project Structure**

```
HzmFrontendVeriTabani/
├── public/                 # Static assets
├── src/
│   ├── api/               # Backend API integration
│   │   ├── config.ts      # API configuration
│   │   ├── projectApi.ts  # Project operations
│   │   ├── tableApi.ts    # Table management
│   │   ├── dataApi.ts     # Data CRUD operations
│   │   └── index.ts       # API barrel exports
│   ├── components/        # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── panels/        # Admin panels
│   │   ├── Layout.tsx     # Main layout
│   │   └── BackendDemo.tsx # API demo component
│   ├── context/           # React Context providers
│   │   ├── AdminAuthContext.tsx    # Admin authentication
│   │   ├── DatabaseContext.tsx     # Local database state
│   │   └── BackendContext.tsx      # Backend API state
│   ├── pages/             # Route components
│   │   ├── AdminUsers.tsx          # User management
│   │   ├── ProjectList.tsx         # Project listing
│   │   ├── ProjectManagement.tsx   # Project details
│   │   └── ProjectDataView.tsx     # Data visualization
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── README.md
```

---

## 🔧 **Available Scripts**

```bash
# Development server
npm run dev          # Start dev server on http://localhost:5173

# Build for production
npm run build        # Create optimized production build

# Preview production build
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Type checking
npm run type-check   # Run TypeScript compiler check
```

---

## 🎨 **UI Components**

### **Admin Panel**
- **User Management**: Kullanıcı CRUD işlemleri
- **Project Overview**: Proje listesi ve istatistikler
- **Table Builder**: Visual tablo oluşturma aracı
- **Data Viewer**: Real-time veri görüntüleme

### **Field Types**
| Type | Description | Example |
|------|-------------|---------|
| **text** | String değerler | "John Doe" |
| **number** | Sayısal değerler | 42, 3.14 |
| **boolean** | True/False | true, false |
| **date** | Tarih/Saat | "2024-01-15T10:30:00Z" |
| **json** | JSON objeler | {"key": "value"} |

---

## 🔗 **Backend API Integration**

### **API Client Usage**
```typescript
import { useBackend } from './context/BackendContext';

function MyComponent() {
  const {
    createProject,
    loadProjectInfo,
    createTable,
    loadTableData,
    isLoading,
    error
  } = useBackend();

  const handleCreateProject = async () => {
    try {
      const project = await createProject("My Project", "Description");
      console.log("Project created:", project);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleCreateProject}>
        Create Project
      </button>
    </div>
  );
}
```

### **API Endpoints**
- **Projects**: `/api/projects/*` - Project management
- **Tables**: `/api/tables/*` - Table operations  
- **Data**: `/api/data/*` - Data CRUD operations

---

## 🧪 **Demo & Testing**

### **Backend Demo Page**
Canlı API testleri için özel demo sayfası:
```
http://localhost:5173/backend-demo
```

**Demo Features:**
- ✅ Backend health check
- ✅ Project creation/loading
- ✅ Table creation with fields
- ✅ Data CRUD operations
- ✅ Real-time API responses

### **Test API Key**
Development için hazır test key:
```
vt_test123demo456789
```

---

## 🎯 **Routes**

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect to admin | Ana sayfa yönlendirmesi |
| `/admin-panel-0923` | AdminUsers | Admin kullanıcı paneli |
| `/admin-panel-0923/login` | AdminLogin | Admin giriş sayfası |
| `/admin-panel-0923/users` | AdminUsers | Kullanıcı yönetimi |
| `/admin-panel-0923/user-projects/:userId` | UserProjects | Kullanıcı projeleri |
| `/backend-demo` | BackendDemo | API test sayfası |
| `/projects` | ProjectList | Proje listesi |
| `/projects/user/:userId/:projectId` | ProjectManagement | Proje yönetimi |
| `/projects/user/:userId/:projectId/data` | ProjectDataView | Veri görüntüleme |

---

## 🛡️ **Security Features**

- **Protected Routes**: Admin paneli için authentication
- **API Key Validation**: Backend API key kontrolü
- **Input Sanitization**: XSS koruması
- **Error Boundaries**: Hata yakalama ve yönetimi
- **Environment Variables**: Sensitive data protection

---

## 🎨 **Styling & Design**

### **Tech Stack**
- **Material-UI (MUI)**: Component library
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first approach

### **Theme Configuration**
```typescript
// Custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});
```

---

## 🚀 **Production Deployment**

### **Build for Production**
```bash
# Create production build
npm run build

# Output directory: dist/
# Ready for deployment to any static hosting
```

### **Deployment Platforms**
- **Vercel**: Automatic deployment from Git
- **Netlify**: Drag & drop or Git integration
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Free hosting for open source

### **Environment Variables**
Production ortamında gerekli environment variables:
```env
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=HZM VeriTabanı
NODE_ENV=production
```

---

## 📱 **Progressive Web App (PWA)**

PWA özelliği aktif:
- ✅ **Offline Support**: Service worker ile cache
- ✅ **Install Prompt**: Ana ekrana ekleme
- ✅ **Push Notifications**: Bildirim desteği (opsiyonel)
- ✅ **App Manifest**: Native app benzeri deneyim

---

## 🔄 **State Management**

### **Context API Structure**
```typescript
// Backend API state
const BackendContext = {
  // Project operations
  projects, selectedProject, createProject, updateProject,
  
  // Table operations  
  selectedTable, createTable, deleteTable,
  
  // Data operations
  loadTableData, createData, updateData, deleteData,
  
  // UI state
  isLoading, error, clearError
};

// Local database state (for offline/demo)
const DatabaseContext = {
  // Local state management
  projects, tables, fields, users
};

// Admin authentication
const AdminAuthContext = {
  isAuthenticated, currentUser, login, logout
};
```

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Follow TypeScript best practices
4. Add proper type definitions
5. Test with backend integration
6. Commit changes: `git commit -am 'Add new feature'`
7. Push to branch: `git push origin feature/new-feature`
8. Submit pull request

### **Code Style**
- **TypeScript**: Strict type checking
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

---

## 📝 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 **Related Projects**

- **Backend**: [HZM Backend VeriTabanı](../HzmBackendVeriTabani) - Node.js backend API
- **Documentation**: [API Docs](docs/) - Comprehensive API documentation

---

## 📞 **Support**

- **Issues**: GitHub Issues sayfasını kullanın
- **Documentation**: README ve inline comments
- **Demo**: `/backend-demo` sayfası ile canlı test

---

**🎯 Modern web uygulamaları için tam özellikli frontend çözümü! React + TypeScript + Material-UI ile profesyonel deneyim.** 