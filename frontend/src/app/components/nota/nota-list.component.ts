import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NotaStoreService } from '../../services/nota-store.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'nota-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-xl font-semibold text-slate-900">Notas fiscais</h3>
      <p class="mt-2 text-sm text-slate-600">
        Confira as notas criadas e emita a nota para atualizar o estoque.
      </p>

      <div class="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead class="bg-slate-50 text-slate-700">
            <tr>
              <th class="px-4 py-3">Número</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Itens</th>
              <th class="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr *ngFor="let nota of notas()">
              <td class="px-4 py-4 font-semibold text-slate-900">{{ nota.numero_sequencial }}</td>
              <td class="px-4 py-4">
                <span
                  [ngClass]="
                    nota.status === 'Aberta'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-emerald-100 text-emerald-800'
                  "
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {{ nota.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-slate-900">{{ nota.itens.length }}</td>
              <td class="px-4 py-4">
                <button
                  (click)="imprimirNota(nota.id)"
                  [disabled]="nota.status !== 'Aberta'"
                  class="rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 bg-[#d91c4d] text-white hover:bg-[#ae173d]"
                >
                  Imprimir
                </button>
              </td>
            </tr>
            <tr *ngIf="notas().length === 0">
              <td colspan="4" class="px-4 py-5 text-center text-slate-500">
                Nenhuma nota criada ainda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class NotaListComponent {
  constructor(
    private notaStore: NotaStoreService,
    private toast: ToastService,
  ) {}

  get notas() {
    return this.notaStore.notas;
  }

  imprimirNota(id: number) {
    this.notaStore.imprimirNota(id).subscribe({
      next: () => {
        this.toast.success('Nota impressa e estoque atualizado com sucesso.');
        this.notaStore.loadNotas();
      },
      error: () => {
        this.toast.error('Erro ao imprimir a nota. Verifique se o estoque tem saldo suficiente.');
      },
    });
  }
}
