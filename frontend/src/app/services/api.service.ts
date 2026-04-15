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

  listProdutos(): Observable<BackendResponse<Produto[]>> {
    return this.http.get<BackendResponse<Produto[]>>(`${this.estoquePath()}/produtos/`);
  }

  createProduto(produto: Omit<Produto, 'id'>): Observable<BackendResponse<Produto>> {
    return this.http.post<BackendResponse<Produto>>(`${this.estoquePath()}/produtos/`, produto);
  }

  listNotas(): Observable<BackendResponse<NotaFiscal[]>> {
    return this.http.get<BackendResponse<NotaFiscal[]>>(`${this.faturamentoPath()}/notas/`);
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
