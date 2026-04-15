import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Produto } from '../types/estoque';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoStoreService {
  produtos = signal<Produto[]>([]);

  constructor(private api: ApiService, private toast: ToastService) {
    this.loadProdutos();
  }

  loadProdutos() {
    this.api.listProdutos().subscribe({
      next: (response) => {
        this.produtos.set(response.data ?? []);
      },
      error: () => {
        this.toast.error('Não foi possível carregar os produtos do estoque.');
      },
    });
  }

  createProduto(produto: Omit<Produto, 'id'>) {
    return this.api.createProduto(produto);
  }
}
