import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemNota, NotaFiscal } from '../types/notafiscal';
import { ApiService, BackendResponse, PaginationResponse } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class NotaStoreService {
  notas = signal<NotaFiscal[]>([]);
  currentPage = signal(1);
  totalItems = signal(0);
  readonly pageSize = 4;

  constructor(
    private api: ApiService,
    private toast: ToastService,
  ) {
    this.loadNotas();
  }

  loadNotas(page = this.currentPage()) {
    this.currentPage.set(page);
    this.api.listNotas(page, this.pageSize).subscribe({
      next: (response) => {
        const data = response.data as PaginationResponse<NotaFiscal>;
        this.notas.set(data?.items ?? []);
        this.totalItems.set(data?.total_items ?? 0);
      },
      error: () => {
        this.toast.error('Não foi possível carregar as notas fiscais.');
      },
    });
  }

  nextPage() {
    const next = this.currentPage() + 1;
    if (next <= this.totalPages) {
      this.loadNotas(next);
    }
  }

  prevPage() {
    const prev = this.currentPage() - 1;
    if (prev >= 1) {
      this.loadNotas(prev);
    }
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalItems() / this.pageSize));
  }

  createNota(nota: { itens: ItemNota[] }): Observable<BackendResponse<NotaFiscal>> {
    return this.api.createNota(nota);
  }

  imprimirNota(id: number): Observable<BackendResponse<NotaFiscal>> {
    return this.api.imprimirNota(id);
  }
}
