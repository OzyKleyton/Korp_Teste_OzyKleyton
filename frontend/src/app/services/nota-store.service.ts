import { Injectable, signal } from '@angular/core';
import { ApiService, BackendResponse } from './api.service';
import { ItemNota, NotaFiscal } from '../types/notafiscal';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotaStoreService {
  notas = signal<NotaFiscal[]>([]);

  constructor(private api: ApiService, private toast: ToastService) {
    this.loadNotas();
  }

  loadNotas() {
    this.api.listNotas().subscribe({
      next: (response) => {
        this.notas.set(response.data ?? []);
      },
      error: () => {
        this.toast.error('Não foi possível carregar as notas fiscais.');
      },
    });
  }

  createNota(nota: { itens: ItemNota[] }): Observable<BackendResponse<NotaFiscal>> {
    return this.api.createNota(nota);
  }

  imprimirNota(id: number): Observable<BackendResponse<NotaFiscal>> {
    return this.api.imprimirNota(id);
  }
}
