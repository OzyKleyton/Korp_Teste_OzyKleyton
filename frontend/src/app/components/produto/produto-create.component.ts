import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProdutoStoreService } from '../../services/produto-store.service';
import { ToastService } from '../../services/toast.service';
import { Produto } from '../../types/estoque';

@Component({
  selector: 'produto-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-xl font-semibold text-slate-900">Cadastrar novo produto</h3>
      <div class="mt-6 space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Código</label>
          <input
            [(ngModel)]="newProduto.codigo"
            class="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#d91c4d] focus:ring-2 focus:ring-[#d91c4d]/20"
            placeholder="Digite o código"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Descrição</label>
          <input
            [(ngModel)]="newProduto.descricao"
            class="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#d91c4d] focus:ring-2 focus:ring-[#d91c4d]/20"
            placeholder="Digite a descrição"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Saldo</label>
          <input
            type="number"
            [(ngModel)]="newProduto.saldo"
            class="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#d91c4d] focus:ring-2 focus:ring-[#d91c4d]/20"
            min="0"
          />
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-600">Saldo disponível para usar em notas fiscais.</p>
          <button
            (click)="createProduto()"
            class="rounded-full bg-[#d91c4d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ae173d]"
          >
            Salvar produto
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProdutoCreateComponent {
  newProduto: Omit<Produto, 'id'> = { codigo: '', descricao: '', saldo: 0 };

  constructor(
    private store: ProdutoStoreService,
    private toast: ToastService,
  ) {}

  createProduto() {
    if (!this.newProduto.codigo || !this.newProduto.descricao || this.newProduto.saldo < 0) {
      this.toast.error('Preencha todos os campos corretamente antes de salvar.');
      return;
    }

    this.store.createProduto(this.newProduto).subscribe({
      next: () => {
        this.toast.success('Produto cadastrado com sucesso.');
        this.newProduto = { codigo: '', descricao: '', saldo: 0 };
        this.store.loadProdutos();
      },
      error: () => {
        this.toast.error('Falha ao cadastrar o produto. Tente novamente.');
      },
    });
  }
}
