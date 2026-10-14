import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsFilePath = path.resolve(__dirname, 'projects.json')

function localProjectsApiPlugin(): Plugin {
  return {
    name: 'local-projects-api',
    configureServer(server) {
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
              // Validate valid JSON
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
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localProjectsApiPlugin(),
  ],
  server: {
    port: 3000,
    open: false
  }
})
