import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvironmentService } from '../environment.service';
import { Produto } from '../types/estoque';
import { ItemNota, NotaFiscal } from '../types/notafiscal';

export interface BackendResponse<T> {
  status: number;
  message?: string;
  data: T;
}

export interface PaginationResponse<T> {
  items: T[];
  total_items: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);

  private estoquePath() {
    return this.env.getEntrypoint('estoque');
  }

  private faturamentoPath() {
    return this.env.getEntrypoint('faturamento');
  }

  listProdutos(page = 1, limit = 10): Observable<BackendResponse<PaginationResponse<Produto>>> {
    return this.http.get<BackendResponse<PaginationResponse<Produto>>>(
      `${this.estoquePath()}/produtos/?page=${page}&limit=${limit}`,
    );
  }

  createProduto(produto: Omit<Produto, 'id'>): Observable<BackendResponse<Produto>> {
    return this.http.post<BackendResponse<Produto>>(`${this.estoquePath()}/produtos/`, produto);
  }

  listNotas(page = 1, limit = 10): Observable<BackendResponse<PaginationResponse<NotaFiscal>>> {
    return this.http.get<BackendResponse<PaginationResponse<NotaFiscal>>>(
      `${this.faturamentoPath()}/notas/?page=${page}&limit=${limit}`,
    );
  }

  createNota(nota: { itens: ItemNota[] }): Observable<BackendResponse<NotaFiscal>> {
    return this.http.post<BackendResponse<NotaFiscal>>(`${this.faturamentoPath()}/notas/`, nota);
  }

  imprimirNota(id: number): Observable<BackendResponse<NotaFiscal>> {
    return this.http.post<BackendResponse<NotaFiscal>>(
      `${this.faturamentoPath()}/notas/${id}/imprimir`,
      {},
    );
  }
}
