import type { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', loadComponent: () => import('@app/index/index.component').then((C) => C.IndexComponent) },
  { path: 'home', loadComponent: () => import('@app/home/home.component').then((C) => C.HomeComponent) }
]
