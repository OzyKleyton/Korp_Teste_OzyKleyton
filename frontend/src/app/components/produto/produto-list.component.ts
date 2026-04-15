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
      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-600">
          Mostrando {{ produtos().length }} de {{ totalItems }} produtos
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            [disabled]="page === 1"
            (click)="store.prevPage()"
          >
            Anterior
          </button>
          <span class="text-sm text-slate-600">Página {{ page }} de {{ totalPages }}</span>
          <button
            type="button"
            class="rounded-full bg-[#d91c4d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ae173d] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            [disabled]="page >= totalPages"
            (click)="store.nextPage()"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProdutoListComponent {
  constructor(public store: ProdutoStoreService) {}

  get page() {
    return this.store.currentPage();
  }

  get totalPages() {
    return this.store.totalPages;
  }

  get totalItems() {
    return this.store.totalItems();
  }

  get pageSize() {
    return this.store.pageSize;
  }

  get produtos() {
    return this.store.produtos;
  }
}
