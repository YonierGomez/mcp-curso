# Curso de MCP (Model Context Protocol) 🤖

Este repositorio contiene material educativo y ejemplos prácticos para aprender sobre el **Model Context Protocol (MCP)**, un protocolo estándar para la comunicación entre aplicaciones de IA y fuentes de datos externas.

## ¿Qué es MCP? 🔍

El **Model Context Protocol (MCP)** es un protocolo de comunicación abierto desarrollado por Anthropic que permite a los modelos de lenguaje (LLMs) acceder de manera segura y estandarizada a recursos externos como:

- 📁 Sistemas de archivos
- 🗄️ Bases de datos
- 🌐 APIs web
- ☁️ Servicios en la nube
- 🛠️ Herramientas y utilidades

### Características principales:

- ✅ **Protocolo estándar**: Interfaz unificada para diferentes fuentes de datos
- ✅ **Seguro**: Control granular de permisos y acceso
- ✅ **Extensible**: Fácil integración de nuevos recursos
- ✅ **Eficiente**: Comunicación optimizada entre componentes

## Arquitectura de MCP 🏗️

La arquitectura de MCP sigue un patrón cliente-servidor que facilita la comunicación entre diferentes componentes:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│    MCP Host     │◄──►│   MCP Server    │
│                 │    │                 │    │                 │
│ (Claude Desktop,│    │ (Aplicación de  │    │ (Acceso a       │
│  VS Code, etc.) │    │  IA, Runtime)   │    │  recursos)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Componentes principales:

#### 1. **MCP Client** 🖥️
- **Definición**: La aplicación que consume los recursos a través del protocolo MCP
- **Ejemplos**: Claude Desktop, VS Code con extensiones de IA, aplicaciones personalizadas
- **Función**: Envía solicitudes y recibe respuestas del MCP Host

#### 2. **MCP Host** 🧠
- **Definición**: El intermediario que coordina la comunicación entre clientes y servidores
- **Función**: 
  - Gestiona las conexiones MCP
  - Valida permisos y seguridad
  - Rutea las solicitudes entre componentes
  - Maneja la autenticación y autorización

#### 3. **MCP Server** 🛠️
- **Definición**: Servicios que exponen recursos específicos a través del protocolo MCP
- **Ejemplos**: 
  - Servidor de archivos (filesystem)
  - Servidor de base de datos (MySQL, PostgreSQL)
  - Servidor de Git
  - Servidores personalizados para APIs específicas
- **Función**: Proporciona acceso controlado a recursos externos

## Tipos de MCP Servers 📚

### 1. **Servidores de Sistema**
- **Filesystem Server**: Acceso a archivos y directorios
- **Git Server**: Operaciones con repositorios Git
- **Shell Server**: Ejecución de comandos del sistema

### 2. **Servidores de Base de Datos**
- **MySQL Server**: Consultas y manipulación de datos MySQL
- **PostgreSQL Server**: Operaciones con bases de datos PostgreSQL
- **SQLite Server**: Acceso a bases de datos SQLite

### 3. **Servidores de APIs Web**
- **REST API Server**: Integración con APIs REST
- **GraphQL Server**: Consultas GraphQL
- **Web Scraping Server**: Extracción de datos web

### 4. **Servidores Especializados**
- **Cloud Services Server**: AWS, Google Cloud, Azure
- **Monitoring Server**: Métricas y logs
- **Documentation Server**: Acceso a documentación

## Prerrequisitos del Curso 📋

1. **Conocimientos básicos de programación**
2. **Familiaridad con línea de comandos**
3. **Python 3.8+** instalado
4. **Node.js 16+** (para algunos servidores)
5. **Git** para control de versiones

## Configuración del entorno MCP 🛠️

### 1. **Instalación de dependencias básicas:**

```bash
# Python y pip
python3 --version
pip install --upgrade pip

# Node.js y npm
node --version
npm --version

# Git
git --version
```

### 2. **Instalación de MCP servers comunes:**

```bash
# Servidor de archivos
pip install mcp-server-filesystem

# Servidor de Git
pip install mcp-server-git

# Servidor de MySQL (ejemplo en este curso)
pip install mysql-connector-python
```

### 3. **Configuración de Claude Desktop con MCP:**

Edita el archivo de configuración de Claude Desktop:

```json
{
  "servers": {
    "filesystem": {
      "command": "python",
      "args": ["-m", "mcp_server_filesystem", "/ruta/permitida"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"]
    }
  }
}
```

## Contenido del Curso 📖

### Módulo 1: Fundamentos de MCP
- Introducción al protocolo MCP
- Arquitectura y componentes
- Casos de uso comunes

### Módulo 2: Configuración práctica
- Instalación y configuración
- Conexión de Claude Desktop con MCP
- Primeros pasos con servidores MCP

### Módulo 3: Servidores MCP en acción
- **Filesystem Server**: Manipulación de archivos
- **Git Server**: Operaciones con repositorios
- **MySQL Server**: Consultas a base de datos

### Módulo 4: Desarrollo de MCP Servers personalizados
- Creación de servidores MCP
- Buenas prácticas de desarrollo
- Testing y debugging

## Ejemplos prácticos incluidos 💼

### 1. **Gestión de archivos** (`🌟_Tesoros_de_Colombia_🌟/`)
Ejemplos de uso del filesystem server con datos de ciudades colombianas:
- Lectura de archivos de texto
- Búsqueda y filtrado de contenido
- Manipulación de estructura de directorios

### 2. **Base de datos** (`db/`)
Configuración y uso de MySQL con MCP:
- Conexión a base de datos
- Ejecución de consultas SQL
- Manipulación de datos

### 3. **Infraestructura** (Terraform)
Ejemplo de automatización con MCP:
- Despliegue de recursos en AWS
- Gestión de buckets S3
- Configuración de infraestructura como código

## Flujo de trabajo típico con MCP 🔄

1. **Configuración**: Definir servidores MCP en el archivo de configuración
2. **Conexión**: El cliente MCP se conecta al host
3. **Descubrimiento**: El host descubre los servidores disponibles
4. **Solicitud**: El cliente envía solicitudes a través del host
5. **Procesamiento**: Los servidores procesan las solicitudes
6. **Respuesta**: Los resultados se devuelven al cliente

## Casos de uso reales 🌟

### Desarrollo de software:
- Acceso a repositorios Git
- Lectura de documentación
- Análisis de código fuente

### Análisis de datos:
- Consultas a bases de datos
- Procesamiento de archivos
- Generación de reportes

### Automatización:
- Despliegue de infraestructura
- Gestión de archivos
- Integración con APIs

### Investigación:
- Acceso a datasets
- Análisis de documentos
- Extracción de información

## Ventajas de usar MCP 🚀

### Para desarrolladores:
- **Estandarización**: Un protocolo unificado para múltiples recursos
- **Reutilización**: Los servidores MCP son reutilizables entre proyectos
- **Modularidad**: Arquitectura modular y extensible
- **Facilidad de desarrollo**: APIs bien definidas

### Para usuarios de IA:
- **Acceso ampliado**: Los modelos pueden acceder a más recursos
- **Personalización**: Configuración adaptada a necesidades específicas
- **Seguridad**: Control granular de permisos
- **Eficiencia**: Comunicación optimizada

## Ejemplo práctico: Deployment en Kubernetes 🚢

Como parte de este curso, se ha implementado un ejemplo práctico de deployment en Kubernetes utilizando el MCP de Kubernetes:

### Recursos creados:

#### 1. **Namespace**: `mcp-curso-dev`
- Namespace dedicado para el entorno de desarrollo del curso MCP

#### 2. **Deployment**: `mcp-curso-app`
- **Imagen**: nginx:1.21
- **Réplicas**: 3 pods
- **Recursos**:
  - CPU: 250m (request) - 500m (limit)
  - Memoria: 64Mi (request) - 128Mi (limit)

#### 3. **Service**: `mcp-curso-service`
- **Tipo**: NodePort
- **Puerto interno**: 80
- **Puerto externo**: 30080
- **Cluster IP**: 10.104.252.163

### Acceso al servicio:
```bash
# Obtener IP de Minikube
minikube ip

# Verificar endpoint (ejemplo con IP 192.168.49.2)
curl -I http://192.168.49.2:30080
```

### Archivos de configuración:
Los manifiestos de Kubernetes están disponibles en:
- `/k8s-manifests/namespace.yaml`
- `/k8s-manifests/deployment.yaml`
- `/k8s-manifests/service.yaml`

### Estado verificado:
✅ **HTTP/1.1 200 OK** - Servicio funcionando correctamente
✅ **3/3 réplicas** - Todas las réplicas ejecutándose
✅ **Nginx 1.21.6** - Servidor web respondiendo

## Recursos adicionales 📚

- [Documentación oficial de MCP](https://docs.anthropic.com/mcp)
- [Repositorio de servidores MCP](https://github.com/modelcontextprotocol)
- [Especificación del protocolo](https://spec.modelcontextprotocol.io/)
- [Comunidad MCP](https://discord.gg/anthropic)

## Contribuir al curso 🤝

Si encuentras errores o tienes sugerencias para mejorar el curso:

1. Abre un issue en el repositorio
2. Envía un pull request con tus mejoras
3. Comparte tus ejemplos de uso

## ⚠️ Consideraciones de seguridad

- **Permisos**: Configura solo los permisos mínimos necesarios
- **Validación**: Siempre valida las entradas antes de procesarlas
- **Logging**: Mantén logs de las operaciones realizadas
- **Actualizaciones**: Mantén los servidores MCP actualizados

## Estructura del repositorio 📁

```
.
├── README.md                    # Esta documentación
├── mcp.json                     # Configuración de MCP servers
├── s3-bucket.tf                 # Ejemplo de infraestructura Terraform
├── terraform.tfvars.example     # Variables de ejemplo
├── k8s-manifests/              # Manifiestos de Kubernetes
│   ├── namespace.yaml          # Namespace mcp-curso-dev
│   ├── deployment.yaml         # Deployment con nginx
│   └── service.yaml            # Service NodePort
├── 🌟_Tesoros_de_Colombia_🌟/   # Datos de ejemplo para filesystem server
│   ├── Barranquilla/
│   ├── Bogota/
│   ├── Bucaramanga/
│   ├── Cali/
│   ├── Cartagena/
│   ├── Manizales/
│   ├── Medellin/
│   ├── Pasto/
│   ├── Pereira/
│   └── Santa_Marta/
└── db/                         # Configuración de base de datos
    ├── compose.yaml            # Docker Compose para MySQL
    ├── sentencia.sql           # Ejemplos de consultas SQL
    └── db/                     # Datos de la base de datos
```

---

**¡Bienvenidos al mundo de MCP!** 🎉

Este curso te proporcionará las herramientas y conocimientos necesarios para aprovechar al máximo el Model Context Protocol y crear aplicaciones de IA más potentes y versátiles.