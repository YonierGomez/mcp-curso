# Bucket S3 Público con Terraform

Este proyecto contiene la configuración de Terraform para desplegar un bucket de S3 público en AWS.

## Características del bucket

- ✅ Acceso público de lectura
- ✅ Versioning habilitado
- ✅ Configuración para hosting web estático
- ✅ Configuración CORS
- ✅ Nombre único con sufijo aleatorio

## Prerrequisitos

1. **Terraform instalado** (versión >= 1.0)
2. **AWS CLI configurado** con credenciales válidas
3. **Permisos de IAM** para crear buckets S3

## Configuración de AWS CLI

```bash
aws configure
```

O configura las variables de ambiente:
```bash
export AWS_ACCESS_KEY_ID="tu-access-key"
export AWS_SECRET_ACCESS_KEY="tu-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

## Uso

1. **Clonar y configurar variables:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edita terraform.tfvars con tus valores
   ```

2. **Inicializar Terraform:**
   ```bash
   terraform init
   ```

3. **Planificar el despliegue:**
   ```bash
   terraform plan
   ```

4. **Aplicar la configuración:**
   ```bash
   terraform apply
   ```

5. **Confirmar la creación** escribiendo `yes` cuando se solicite.

## Variables configurables

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `aws_region` | Región de AWS | `us-east-1` |
| `bucket_name` | Nombre base del bucket | `mi-bucket-publico-s3` |
| `environment` | Ambiente (dev/staging/prod) | `dev` |

## Outputs

Después del despliegue, obtendrás:

- `bucket_name`: Nombre completo del bucket creado
- `bucket_arn`: ARN del bucket
- `bucket_domain_name`: Nombre de dominio del bucket
- `bucket_website_endpoint`: Endpoint para hosting web
- `bucket_website_domain`: Dominio del sitio web

## Uso como sitio web estático

Para usar el bucket como hosting web, sube tus archivos HTML:

```bash
aws s3 cp index.html s3://nombre-del-bucket/
aws s3 cp error.html s3://nombre-del-bucket/
```

Luego accede a tu sitio en: `http://nombre-del-bucket.s3-website-us-east-1.amazonaws.com`

## Limpieza

Para eliminar todos los recursos creados:

```bash
terraform destroy
```

## ⚠️ Advertencias de seguridad

- Este bucket es **público**, cualquiera puede leer los archivos
- No subas información sensible o privada
- Considera implementar políticas más restrictivas para producción
- Monitorea los costos de AWS regularmente

## Estructura de archivos

```
.
├── s3-bucket.tf              # Configuración principal de Terraform
├── terraform.tfvars.example  # Ejemplo de variables
└── README.md                 # Este archivo
```
# mcp-curso