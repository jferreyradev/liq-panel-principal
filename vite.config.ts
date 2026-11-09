import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsFilePath = path.resolve(__dirname, 'projects.json')

interface ApiEnvConfig {
  id: string;
  nombre: string;
  url: string;
  apiKey?: string;
}

function parseApiEnvironments(raw?: string): ApiEnvConfig[] {
  try {
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Error parseando API_ENVIRONMENTS del .env:', err)
  }
  return [
    {
      id: 'rpi-prod',
      nombre: 'Producción (Raspberry Pi)',
      url: 'https://api-rpi.liqsysonline.com',
      apiKey: ''
    }
  ]
}

function localBackendApiPlugin(rawEnvironments?: string): Plugin {
  return {
    name: 'local-backend-api',
    configureServer(server) {
      // 1. Projects API
      server.middlewares.use('/api/projects', (req, res) => {
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(projectsFilePath)) {
              const data = fs.readFileSync(projectsFilePath, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(data)
              return
            }
          } catch (e) {
            console.error('Error reading projects.json:', e)
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify([]))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body)
              fs.writeFileSync(projectsFilePath, JSON.stringify(parsed, null, 2), 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, count: parsed.length }))
            } catch (err) {
              console.error('Error saving projects.json:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to write projects.json' }))
            }
          })
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })

      // 2. Environments list (ONLY returns public fields: id, nombre. No URLs or API keys)
      server.middlewares.use('/api/environments', (req, res) => {
        if (req.method === 'GET') {
          const envs = parseApiEnvironments(rawEnvironments)
          const publicList = envs.map(e => ({ id: e.id, nombre: e.nombre }))
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(publicList))
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })

      // 3. Auth Login Proxy (Injects X-API-Key securely and proxies to target API)
      server.middlewares.use('/api/auth/login', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', chunk => {
          body += chunk
        })

        req.on('end', async () => {
          try {
            const { envId, usr, pws } = JSON.parse(body || '{}')

            if (!usr || !pws) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ status: 'error', error: 'Debe ingresar usuario y contraseña.' }))
              return
            }

            const envs = parseApiEnvironments(rawEnvironments)
            const targetEnv = envs.find(e => e.id === envId) || envs[0]

            if (!targetEnv || !targetEnv.url) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ status: 'error', error: 'Entorno o servidor no configurado.' }))
              return
            }

            const targetUrl = `${targetEnv.url.replace(/\/+$/, '')}/api/auth/login`
            const headers: Record<string, string> = {
              'Content-Type': 'application/json'
            }

            if (targetEnv.apiKey && targetEnv.apiKey.trim()) {
              headers['X-API-Key'] = targetEnv.apiKey.trim()
            }

            try {
              const apiResponse = await fetch(targetUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({ usr, pws })
              })

              const responseText = await apiResponse.text()
              res.statusCode = apiResponse.status
              res.setHeader('Content-Type', 'application/json')
              res.end(responseText)
            } catch (fetchErr: any) {
              console.error(`Error conectando con la API en ${targetUrl}:`, fetchErr?.message || fetchErr)
              res.statusCode = 502
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                status: 'error',
                code: 'SERVER_UNREACHABLE',
                error: `No se pudo conectar con el servidor "${targetEnv.nombre}". Verifique que esté online o accesible.`
              }))
            }
          } catch (err: any) {
            console.error('Error procesando login proxy:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', error: 'Error interno en el proxy de autenticación.' }))
          }
        })
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      localBackendApiPlugin(env.API_ENVIRONMENTS),
    ],
    server: {
      port: 3000,
      open: false
    }
  }
})
