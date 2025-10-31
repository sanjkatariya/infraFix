# Docker Setup Guide for InfraFix

This guide explains how to run InfraFix using Docker and Docker Compose.

## 📋 Prerequisites

- Docker Desktop installed (or Docker Engine + Docker Compose)
- At least 2GB of free disk space
- Ports 80 and 3000 available on your machine

## 🚀 Quick Start

### Production Build

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api
   - API Health: http://localhost:3000/api/health

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Development Build

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend API: http://localhost:3000/api

3. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## 📦 Individual Services

### Build Frontend Only

```bash
# Production
docker build -t infrafix-frontend .
docker run -p 80:80 infrafix-frontend

# Development
docker build -f Dockerfile.dev -t infrafix-frontend-dev .
docker run -p 5173:5173 -v $(pwd):/app infrafix-frontend-dev
```

### Build Backend Only

```bash
cd server

# Production
docker build -t infrafix-backend .
docker run -p 3000:3000 infrafix-backend

# Development
docker build -f Dockerfile.dev -t infrafix-backend-dev .
docker run -p 3000:3000 -v $(pwd):/app infrafix-backend-dev
```

## 🐳 Docker Compose Commands

### Common Commands

```bash
# Start services in detached mode
docker-compose up -d

# Start services and view logs
docker-compose up

# Rebuild containers
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute command in container
docker-compose exec backend node -v
docker-compose exec frontend npm -v

# Check container status
docker-compose ps

# Restart a specific service
docker-compose restart backend
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3000/api

# Backend
NODE_ENV=production
PORT=3000
API_BASE_URL=http://localhost:3000/api
```

Then update `docker-compose.yml` to use these variables:

```yaml
services:
  backend:
    env_file:
      - .env
  frontend:
    env_file:
      - .env
```

### Port Configuration

To change ports, edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "YOUR_PORT:3000"  # Change YOUR_PORT
  frontend:
    ports:
      - "YOUR_PORT:80"     # Change YOUR_PORT
```

## 📊 Container Details

### Frontend Container
- **Base Image:** nginx:alpine
- **Port:** 80
- **Build Stage:** Multi-stage build (Node for build, Nginx for serve)
- **Health Check:** Nginx default health endpoint

### Backend Container
- **Base Image:** node:20-alpine
- **Port:** 3000
- **User:** Non-root (nodejs user)
- **Health Check:** `/api/health` endpoint

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `port is already allocated`

**Solution:**
1. Find process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :80
   
   # Linux/Mac
   lsof -i :80
   ```

2. Kill the process or change port in `docker-compose.yml`

### Container Won't Start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Check container status:**
```bash
docker-compose ps
```

### Build Fails

1. **Clear Docker cache:**
   ```bash
   docker system prune -a
   ```

2. **Rebuild without cache:**
   ```bash
   docker-compose build --no-cache
   ```

### Permission Issues (Linux/Mac)

If you get permission errors:

```bash
sudo chown -R $USER:$USER .
```

### Container Keeps Restarting

Check health check logs:
```bash
docker-compose logs backend
docker inspect infrafix-backend
```

## 🔒 Security Considerations

### Production Deployment

1. **Use environment variables** for secrets
2. **Don't commit** `.env` files
3. **Use Docker secrets** for sensitive data
4. **Enable HTTPS** with reverse proxy (Nginx, Traefik)
5. **Scan images** for vulnerabilities:
   ```bash
   docker scan infrafix-frontend
   docker scan infrafix-backend
   ```

### Non-Root User

The backend container runs as non-root user (`nodejs`) for security.

## 📈 Production Deployment

### Option 1: Single Server

```bash
# Build
docker-compose build

# Run
docker-compose up -d
```

### Option 2: Separate Servers

Build images separately and deploy:

```bash
# Build frontend
docker build -t infrafix-frontend:latest .

# Build backend
cd server
docker build -t infrafix-backend:latest .
```

Push to registry and deploy to separate servers.

### Option 3: Cloud Deployment

- **AWS:** ECS, Fargate, or Elastic Beanstalk
- **Google Cloud:** Cloud Run, GKE
- **Azure:** Container Instances, AKS
- **DigitalOcean:** App Platform, Droplets

## 📝 Dockerfile Optimization

### Multi-Stage Builds
- Frontend uses multi-stage build (build → nginx)
- Reduces final image size

### Layer Caching
- Dependencies installed before source code copy
- Faster rebuilds when only code changes

### Alpine Images
- Uses lightweight Alpine Linux
- Smaller image size (~50MB vs ~500MB)

## 🔍 Inspecting Containers

```bash
# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# View container details
docker inspect infrafix-backend

# View resource usage
docker stats

# View network
docker network inspect infrafix-network
```

## 🧹 Cleanup

```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker rmi infrafix-frontend infrafix-backend

# Clean system (careful - removes all unused data)
docker system prune -a
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)

---

**Need help?** Check logs first: `docker-compose logs -f`

