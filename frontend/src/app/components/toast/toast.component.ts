import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'toast-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      <div
        *ngFor="let toast of toasts()"
        [ngClass]="{
          'border-emerald-200 bg-emerald-50 text-emerald-900': toast.type === 'success',
          'border-rose-200 bg-rose-50 text-rose-900': toast.type === 'error',
          'border-sky-200 bg-sky-50 text-sky-900': toast.type === 'info',
        }"
        class="rounded-3xl border p-4 shadow-lg shadow-slate-200/50"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="text-sm font-semibold">{{ toast.type | titlecase }}</p>
            <p class="text-sm leading-6">{{ toast.text }}</p>
          </div>
          <button
            type="button"
            (click)="dismiss(toast.id)"
            class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ToastComponent {
  constructor(private toast: ToastService) {}

  toasts = computed(() => this.toast.toasts());

  dismiss(id: number) {
    this.toast.dismiss(id);
  }
}
