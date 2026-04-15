import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NotaFormComponent } from './nota-form.component';
import { NotaListComponent } from './nota-list.component';

@Component({
  selector: 'nota-page',
  standalone: true,
  imports: [CommonModule, NotaFormComponent, NotaListComponent],
  template: `
    <div class="space-y-8">
      <section class="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">Faturamento</h2>
            <p class="mt-2 text-sm text-slate-600">
              Crie notas fiscais, adicione produtos e emita a nota para atualizar o estoque automaticamente.
            </p>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <nota-form></nota-form>
        <nota-list></nota-list>
      </section>
    </div>
  `,
})
export class NotaPage {}
