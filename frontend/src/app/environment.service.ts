import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AppEnvironment {
  estoqueApiPath: string;
  faturamentoApiPath: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private http = inject(HttpClient);
  private env: AppEnvironment = {
    estoqueApiPath: '/estoque/api/v1',
    faturamentoApiPath: '/faturamento/api/v1',
  };

  async load(): Promise<void> {
    try {
      const config = await firstValueFrom(this.http.get<AppEnvironment>('/assets/env.json'));
      this.env = { ...this.env, ...config };
    } catch {
      console.warn('Não foi possível carregar env.json. Usando valores padrão de endpoints.');
    }
  }

  getEntrypoint(service: 'estoque' | 'faturamento'): string {
    return service === 'estoque' ? this.env.estoqueApiPath : this.env.faturamentoApiPath;
  }
}
