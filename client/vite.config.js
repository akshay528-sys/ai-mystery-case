import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'

const isLocalhost = (hostname) => {
  const normalizedHostname = hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, '')
    .replace(/\.$/, '')

  return normalizedHostname === 'localhost'
    || normalizedHostname.endsWith('.localhost')
    || normalizedHostname === '::1'
    || normalizedHostname === '0.0.0.0'
    || /^127\./.test(normalizedHostname)
}

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const apiUrl = process.env.VITE_API_URL?.trim() || env.VITE_API_URL?.trim()

    if (!apiUrl) {
      throw new Error('VITE_API_URL must be configured for production builds.')
    }

    let parsedApiUrl
    try {
      parsedApiUrl = new URL(apiUrl)
    } catch {
      throw new Error('VITE_API_URL must be an absolute HTTPS URL.')
    }

    if (parsedApiUrl.protocol !== 'https:') {
      throw new Error('VITE_API_URL must use HTTPS in production builds.')
    }

    if (isLocalhost(parsedApiUrl.hostname)) {
      throw new Error('VITE_API_URL must not point to localhost in production builds.')
    }

    if (parsedApiUrl.username || parsedApiUrl.password) {
      throw new Error('VITE_API_URL must not contain credentials.')
    }
  }

  return {
    plugins: [react()],
  }
})
