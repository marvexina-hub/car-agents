# Car Agents

Sistema multi-agente de búsqueda de autos usando MercadoLibre Argentina + Claude AI.

## Estructura

```
car-agents/
├── api/
│   └── search.js        ← Serverless function (proxy a ML API)
├── public/
│   └── index.html       ← Frontend con los 4 agentes
├── vercel.json
└── package.json
```

## Por qué esta estructura

El browser no puede llamar directamente a MercadoLibre por CORS.
La solución: el frontend llama a `/api/search` (tu propio servidor en Vercel),
y ese servidor llama a ML. Sin restricciones.

## Deploy en Vercel

```bash
# 1. Subí el proyecto a GitHub
git init
git add .
git commit -m "car agents v1"
git remote add origin https://github.com/TU_USER/car-agents
git push -u origin main

# 2. En vercel.com → New Project → importá el repo
# 3. Deploy automático. Listo.
```

## Cómo funciona el pipeline

```
Usuario ingresa preferencias
        ↓
AGENTE BUSCADOR → llama /api/search → filtra por presupuesto y año
        ↓ pasa lista de autos al
AGENTE ANALISTA → evalúa con Claude → selecciona top 4 con puntaje
        ↓ pasa selección al
AGENTE CRÍTICO  → evalúa con Claude → red flags y ajuste de puntaje
        ↓ pasa todo al
AGENTE SÍNTESIS → evalúa con Claude → veredicto final en texto
```

Cada agente recibe el output del anterior. Nadie le dice a cada agente
qué tiene que encontrar — razona sobre los datos que recibe.
