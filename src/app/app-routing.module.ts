import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'main',
    canLoad: [AuthGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main/tabs/tab1'
  },
  {
    path: 'new-eventosae-modal',
    loadChildren: () => import('./pages/new-eventosae-modal/new-eventosae-modal.module').then( m => m.NewEventosaeModalPageModule)
  },
  {
    path: 'message/:id',
    loadChildren: () => import('./pages/view-eventosae/view-eventosae.module').then( m => m.ViewEventosaePageModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
