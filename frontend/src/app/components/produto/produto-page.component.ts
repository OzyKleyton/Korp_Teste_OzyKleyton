import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ProdutoCreateComponent } from './produto-create.component';
import { ProdutoListComponent } from './produto-list.component';

@Component({
  selector: 'produto-page',
  standalone: true,
  imports: [CommonModule, ProdutoCreateComponent, ProdutoListComponent],
  template: `
    <div class="space-y-8">
      <section class="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">Estoque de Produtos</h2>
            <p class="mt-2 text-sm text-slate-600">
              Cadastre produtos e gerencie saldo de estoque para emissão de notas fiscais.
            </p>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <produto-create></produto-create>
        <produto-list></produto-list>
      </section>
    </div>
  `,
})
export class ProdutoPage {}
