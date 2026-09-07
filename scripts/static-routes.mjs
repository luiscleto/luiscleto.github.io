import { mkdir, copyFile } from 'node:fs/promises'

// GitHub Pages needs an actual entry file for direct visits and refreshes.
await mkdir('dist/journey', { recursive: true })
await copyFile('dist/index.html', 'dist/journey/index.html')
