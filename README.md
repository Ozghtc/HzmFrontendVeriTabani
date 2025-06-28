# HZMSoft Database Pro - Backend API

Professional database management system backend built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Project Management**: Create and manage database projects
- **Dynamic Table Creation**: Create tables with custom fields and validation
- **API Key Authentication**: Secure access with project-specific API keys
- **CRUD Operations**: Full data management capabilities
- **User Management**: Authentication and authorization
- **Rate Limiting**: Configurable API rate limits
- **Data Validation**: Comprehensive input validation
- **PostgreSQL Integration**: Robust database operations

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hzmsoft-database-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hzmsoft_database_pro
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key
   
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE hzmsoft_database_pro;
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Projects

#### Create Project
```http
POST /api/v1/projects
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

#### Get Projects
```http
GET /api/v1/projects
Authorization: Bearer <jwt_token>
```

#### Get Project by API Key
```http
GET /api/v1/projects/by-api-key/<api_key>
x-api-key: <project_api_key>
```

### Tables

#### Create Table
```http
POST /api/v1/projects/<project_id>/tables
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "users",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "required": true,
      "validation": {
        "maxLength": 255
      }
    },
    {
      "name": "age",
      "type": "number",
      "required": false,
      "validation": {
        "minValue": 0,
        "maxValue": 150
      }
    }
  ]
}
```

#### Get Tables
```http
GET /api/v1/projects/<project_id>/tables
Authorization: Bearer <jwt_token>
```

### Data Operations

#### Create Record
```http
POST /api/v1/projects/<project_id>/tables/<table_id>/data
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "user@example.com",
  "age": 25
}
```

#### Get Records
```http
GET /api/v1/projects/<project_id>/tables/<table_id>/data?page=1&limit=50
Authorization: Bearer <jwt_token>
```

#### Update Record
```http
PUT /api/v1/projects/<project_id>/tables/<table_id>/data/<record_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "age": 26
}
```

#### Delete Record
```http
DELETE /api/v1/projects/<project_id>/tables/<table_id>/data/<record_id>
Authorization: Bearer <jwt_token>
```

### API Key Operations

#### Create API Key
```http
POST /api/v1/api-keys/project/<project_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Frontend App Key",
  "permissions": ["read", "write"],
  "rateLimit": 1000,
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

#### Get API Keys
```http
GET /api/v1/api-keys/project/<project_id>
Authorization: Bearer <jwt_token>
```

## 🔐 API Key Authentication

For external access, use the `x-api-key` header:

```http
GET /api/v1/projects/<project_id>/tables/<table_id>/data/api
x-api-key: hzm_<your_api_key>
```

## 🏗️ Project Structure

```
src/
├── database/
│   ├── connection.js      # Database connection and migrations
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   ├── notFound.js       # 404 handler
│   └── validation.js     # Input validation
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── projects.js      # Project management
│   ├── tables.js        # Table operations
│   ├── data.js          # Data CRUD operations
│   └── apiKeys.js       # API key management
├── utils/
│   ├── apiKeyGenerator.js # API key utilities
│   └── tableManager.js    # Database table operations
└── server.js            # Main application file
```

## 🔧 Field Types

Supported field types:
- `string` - Text data
- `number` - Numeric data
- `boolean` - True/false values
- `date` - Date/timestamp
- `object` - JSON objects
- `array` - JSON arrays
- `currency` - Decimal with currency support
- `weight` - Decimal with weight units

## 🛡️ Security Features

- JWT-based authentication
- API key authorization
- Rate limiting
- Input validation
- SQL injection prevention
- CORS protection
- Helmet security headers

## 🚀 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "hzmsoft-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📊 Monitoring

Health check endpoint:
```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "HZMSoft Database Pro API",
  "version": "1.0.0"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@hzmsoft.com or create an issue in the repository.# Force deployment Fri Jun 27 07:43:51 PDT 2025
# Deploy fix Sat Jun 28 16:11:35 PDT 2025
