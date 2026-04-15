import { Routes } from '@angular/router';
import { NotaPage } from './components/nota/nota-page.component';
import { ProdutoPage } from './components/produto/produto-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ProdutoPage },
  { path: 'notas', component: NotaPage },
];
