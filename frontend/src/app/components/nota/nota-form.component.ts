import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NotaStoreService } from '../../services/nota-store.service';
import { ProdutoStoreService } from '../../services/produto-store.service';
import { ToastService } from '../../services/toast.service';
import { Produto } from '../../types/estoque';
import { ItemNota } from '../../types/notafiscal';

@Component({
  selector: 'nota-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-xl font-semibold text-slate-900">Nova nota fiscal</h3>
      <p class="mt-2 text-sm text-slate-600">
        Adicione produtos ao item da nota e depois envie para emissão.
      </p>

      <div class="mt-6 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Produto</label>
            <select
              [(ngModel)]="currentItem.produto_id"
              (ngModelChange)="updateSelectedProduct($event)"
              class="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-[#d91c4d] focus:ring-2 focus:ring-[#d91c4d]/20"
            >
              <option [ngValue]="0">Selecione</option>
              <option *ngFor="let produto of produtos()" [ngValue]="produto.id">
                {{ produto.codigo }} - {{ produto.descricao }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Quantidade</label>
            <input
              type="number"
              [(ngModel)]="currentItem.quantidade"
              min="1"
              class="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-[#d91c4d] focus:ring-2 focus:ring-[#d91c4d]/20"
            />
          </div>
        </div>
        <button
          (click)="addItem()"
          class="rounded-full bg-[#d91c4d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ae173d]"
        >
          Adicionar item
        </button>

        <div *ngIf="itens.length > 0" class="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div class="mb-4 flex items-center justify-between">
            <h4 class="text-lg font-semibold text-slate-900">Itens adicionados</h4>
            <span class="rounded-full bg-[#d91c4d]/10 px-3 py-1 text-sm text-[#a2173f]"
              >{{ itens.length }} item(s)</span
            >
          </div>
          <ul class="space-y-3">
            <li
              *ngFor="let item of itens; let idx = index"
              class="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <div class="font-semibold text-slate-900">
                  {{ lookupProduct(item.produto_id)?.descricao ?? '---' }}
                </div>
                <div class="text-sm text-slate-500">Quantidade: {{ item.quantidade }}</div>
              </div>
              <button
                (click)="removeItem(idx)"
                class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Remover
              </button>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-600">
            A nota fiscal só será criada com todos os itens informados.
          </p>
          <button
            (click)="createNota()"
            class="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Criar nota
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NotaFormComponent {
  itens: ItemNota[] = [];
  currentItem: ItemNota = { produto_id: 0, quantidade: 1 };

  constructor(
    private produtoStore: ProdutoStoreService,
    private notaStore: NotaStoreService,
    private toast: ToastService,
  ) {}

  get produtos() {
    return this.produtoStore.produtos;
  }

  updateSelectedProduct(value: number | string) {
    this.currentItem.produto_id = Number(value);
  }

  addItem() {
    if (!this.currentItem.produto_id || this.currentItem.quantidade <= 0) {
      this.toast.error('Escolha um produto e uma quantidade maior que zero.');
      return;
    }

    if (this.itens.some((item) => item.produto_id === this.currentItem.produto_id)) {
      this.toast.error(
        'Este produto já está na nota. Remova e adicione novamente se quiser alterar a quantidade.',
      );
      return;
    }

    this.itens = [...this.itens, { ...this.currentItem }];
    this.currentItem = { produto_id: 0, quantidade: 1 };
    this.toast.success('Item adicionado à nota.');
  }

  removeItem(index: number) {
    this.itens = this.itens.filter((_, idx) => idx !== index);
  }

  createNota() {
    if (this.itens.length === 0) {
      this.toast.error('Adicione ao menos um item antes de criar a nota.');
      return;
    }

    this.notaStore.createNota({ itens: this.itens }).subscribe({
      next: () => {
        this.toast.success('Nota fiscal criada com sucesso.');
        this.itens = [];
        this.notaStore.loadNotas();
      },
      error: () => {
        this.toast.error('Erro ao criar nota. Verifique os serviços e tente novamente.');
      },
    });
  }

  lookupProduct(produtoId: number): Produto | undefined {
    return this.produtos().find((produto) => produto.id === produtoId);
  }
}
