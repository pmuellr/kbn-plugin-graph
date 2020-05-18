export interface Plugin {
  baseDir: string
  id: string,
  ui: boolean
  server: boolean
  plugins: string[]
  requiredPlugins: string[]
  optionalPlugins: string[]
}