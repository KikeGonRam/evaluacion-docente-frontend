# Examen de Evaluación: Frontend SED - UTVT (Java Spring Boot Ecosystem)

Este proyecto constituye la entrega del **Examen de Evaluación** para el desarrollo de un Sistema de Evaluación Docente (SED) para la **Universidad Tecnológica del Valle de Toluca (UTVT)**. 

El objetivo principal es demostrar la capacidad de integración de una interfaz moderna en Next.js con un ecosistema de servicios robusto basado en **Java y Spring Boot**.

## 🛠️ Integración del Ecosistema Técnico

- **Backend:** Desarrollado íntegramente en **Java Spring Boot**, exponiendo una API RESTful para la persistencia y lógica de negocio.
- **Frontend:** Implementado con **Next.js 15** y **Tailwind CSS v4**, optimizado para el consumo eficiente de recursos del backend.
- **Contexto de Evaluación:** Este proyecto ha sido diseñado para cumplir con los estándares de arquitectura de software, UX/UI institucional y buenas prácticas de desarrollo web.

## 🚀 Características del Sistema

- **Dashboard Inteligente:** Visualización de métricas clave del sistema con indicadores de tendencia.
- **Analítica Visual:** Gráficas dinámicas de rendimiento y calidad académica.
- **Gestión Institucional:** Administración completa de Docentes, Estudiantes, Cuestionarios y Aplicaciones de Evaluación.
- **Feedback Narrativo:** Sistema `ActionFeedback` con animaciones de éxito y error para una mejor experiencia de usuario.
- **Branding UTVT:** Identidad visual real basada en los colores Verde Institucional y Dorado Premium.

## 📦 Configuración para el Examen

1. **Backend (Java Spring Boot):**
   Asegúrese de tener el servidor de Spring Boot ejecutándose en el puerto `8080` (o el configurado en la API).

2. **Frontend (Next.js):**
   ```bash
   npm install
   npm run dev
   ```

3. **Variables de Entorno:**
   Definir en `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

---
**Proyecto desarrollado como parte de la evaluación técnica de arquitectura Java/Frontend.**
