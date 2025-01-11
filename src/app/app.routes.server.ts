import { RenderMode } from '@angular/ssr'

import type { ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  { path: 'home', renderMode: RenderMode.Server },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
]
