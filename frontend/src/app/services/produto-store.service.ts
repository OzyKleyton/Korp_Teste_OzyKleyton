import { Injectable, signal } from '@angular/core';
import { Produto } from '../types/estoque';
import { ApiService, PaginationResponse } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoStoreService {
  produtos = signal<Produto[]>([]);
  currentPage = signal(1);
  totalItems = signal(0);
  readonly pageSize = 5;

  constructor(
    private api: ApiService,
    private toast: ToastService,
  ) {
    this.loadProdutos();
  }

  loadProdutos(page = 1) {
    this.currentPage.set(page);
    this.api.listProdutos(page, this.pageSize).subscribe({
      next: (response) => {
        const data = response.data as PaginationResponse<Produto>;
        this.produtos.set(data?.items ?? []);
        this.totalItems.set(data?.total_items ?? 0);
      },
      error: () => {
        this.toast.error('Não foi possível carregar os produtos do estoque.');
      },
    });
  }

  nextPage() {
    const next = this.currentPage() + 1;
    if (next <= this.totalPages) {
      this.loadProdutos(next);
    }
  }

  prevPage() {
    const prev = this.currentPage() - 1;
    if (prev >= 1) {
      this.loadProdutos(prev);
    }
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalItems() / this.pageSize));
  }

  createProduto(produto: Omit<Produto, 'id'>) {
    return this.api.createProduto(produto);
  }
}
