import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ProdutoStoreService } from '../../services/produto-store.service';

@Component({
  selector: 'produto-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-xl font-semibold text-slate-900">Produtos cadastrados</h3>
      <p class="mt-2 text-sm text-slate-600">
        Visualize o estoque atual e confirme os saldos antes de emitir notas.
      </p>
      <div class="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead class="bg-slate-50 text-slate-700">
            <tr>
              <th class="px-4 py-3">Código</th>
              <th class="px-4 py-3">Descrição</th>
              <th class="px-4 py-3">Saldo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr *ngFor="let produto of produtos()">
              <td class="px-4 py-4 text-slate-900">{{ produto.codigo }}</td>
              <td class="px-4 py-4 text-slate-900">{{ produto.descricao }}</td>
              <td class="px-4 py-4 font-semibold text-[#d91c4d]">{{ produto.saldo }}</td>
            </tr>
            <tr *ngIf="produtos().length === 0">
              <td colspan="3" class="px-4 py-5 text-center text-slate-500">
                Nenhum produto cadastrado ainda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProdutoListComponent {
  constructor(public store: ProdutoStoreService) {}

  get produtos() {
    return this.store.produtos;
  }
}
