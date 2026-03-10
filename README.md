# Sistema de Evaluación Docente Académica (SED) - UTVT

Este proyecto es el frontend moderno y profesional para el **Sistema de Evaluación Docente** de la **Universidad Tecnológica del Valle de Toluca (UTVT)**. Desarrollado con Next.js 15 y Tailwind CSS, el sistema ofrece una experiencia de usuario de alto nivel orientada a la gestión y análisis de la calidad educativa.

## 🚀 Características Principales

- **Dashboard Inteligente:** Visualización de métricas clave (Total de evaluaciones, docentes, cuestionarios y score global) con indicadores de tendencia.
- **Analítica Visual:** Gráficas dinámicas de rendimiento mensual y distribución de score institucional.
- **Gestión Integral:** Módulos completos para la administración de:
  - **Docentes:** Catálogo institucional con perfiles detallados.
  - **Estudiantes:** Padrón escolar habilitado para evaluar.
  - **Cuestionarios:** Diseño dinámico de instrumentos de evaluación.
  - **Evaluaciones:** Proceso de registro con escala visual humanizada e iconos vectoriales.
- **Feedback de Alto Impacto:** Sistema de notificaciones centralizadas (`ActionFeedback`) con efectos de celebración para éxitos y alertas visuales para errores.
- **Ranking Institucional:** Cuadro de honor con gamificación (medallas de oro, plata y bronce) y sellos de excelencia académica.

## 🎨 Identidad Visual y Diseño

El sistema ha sido diseñado bajo una estética de **"Excelencia Académica"**, utilizando la identidad corporativa real de la UTVT:

- **Paleta de Colores:** Verde Institucional (`#006B3F`), Verde Claro (`#00A85A`), Dorado Premium (`#C9A84C`) y Verde Profundo (`#050F0A`).
- **Glassmorphism:** Uso de transparencias suaves, desenfoques de fondo (`backdrop-blur`) y bordes orgánicos para una sensación moderna y ligera.
- **Accesibilidad:** Contraste optimizado para garantizar la legibilidad en todos los niveles operativos.
- **Fondo Institucional:** Patrón geométrico sutil inspirado en la marca universitaria.

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/) (SVG personalizados)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## 📦 Instalación y Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/KikeGonRam/evaluacion-docente-frontend.git
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env.local` y definir la URL de la API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📄 Licencia

Este proyecto es para uso exclusivo de la Universidad Tecnológica del Valle de Toluca (UTVT).

---
