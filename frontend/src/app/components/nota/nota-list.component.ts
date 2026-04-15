import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingBarModule, LoadingBarService } from '@ngx-loading-bar/core';
import { finalize } from 'rxjs/operators';

import { NotaStoreService } from '../../services/nota-store.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'nota-list',
  standalone: true,
  imports: [CommonModule, LoadingBarModule],
  template: `
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 class="text-xl font-semibold text-slate-900">Notas fiscais</h3>
      <p class="mt-2 text-sm text-slate-600">
        Confira as notas criadas e emita a nota para atualizar o estoque.
      </p>

      <ngx-loading-bar
        *ngIf="processingId !== 0"
        [includeSpinner]="true"
        color="#d91c4d"
        height="4px"
        class="mb-4"
      ></ngx-loading-bar>

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
                  [disabled]="nota.status !== 'Aberta' || processingId === nota.id"
                  class="rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 bg-[#d91c4d] text-white hover:bg-[#ae173d]"
                >
                  {{ processingId === nota.id ? 'Imprimindo...' : 'Imprimir' }}
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
      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-600">
          Mostrando {{ notas().length }} de {{ totalItems }} notas fiscais
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            [disabled]="page === 1"
            (click)="notaStore.prevPage()"
          >
            Anterior
          </button>
          <span class="text-sm text-slate-600">Página {{ page }} de {{ totalPages }}</span>
          <button
            type="button"
            class="rounded-full bg-[#d91c4d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ae173d] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            [disabled]="page >= totalPages"
            (click)="notaStore.nextPage()"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NotaListComponent {
  processingId = 0;

  constructor(
    public notaStore: NotaStoreService,
    private toast: ToastService,
    private loadingBar: LoadingBarService,
  ) {}

  get page() {
    return this.notaStore.currentPage();
  }

  get totalPages() {
    return this.notaStore.totalPages;
  }

  get totalItems() {
    return this.notaStore.totalItems();
  }

  get notas() {
    return this.notaStore.notas;
  }

  imprimirNota(id: number) {
    this.processingId = id;
    this.loadingBar.start();

    this.notaStore
      .imprimirNota(id)
      .pipe(
        finalize(() => {
          this.processingId = 0;
          this.loadingBar.complete();
        }),
      )
      .subscribe({
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
