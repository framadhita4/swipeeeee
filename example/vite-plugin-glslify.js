import path from 'node:path'
import { compile } from 'glslify'

const GLSL_EXTENSIONS = /\.(glsl|vert|frag)(\?.*)?$/

export default function glslifyPlugin() {
  return {
    name: 'vite-plugin-glslify',
    enforce: 'pre',
    transform(code, id) {
      if (!GLSL_EXTENSIONS.test(id)) return null

      const filePath = id.split('?')[0]
      const compiled = compile(code, {
        basedir: path.dirname(filePath),
      })

      return { code: compiled, map: null }
    },
  }
}
