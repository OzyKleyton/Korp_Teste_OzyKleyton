import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private counter = 0;
  public toasts = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'info') {
    const id = ++this.counter;
    this.toasts.set([...this.toasts(), { id, type, text: message }]);
    window.setTimeout(() => this.dismiss(id), 4000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  dismiss(id: number) {
    this.toasts.set(this.toasts().filter((toast) => toast.id !== id));
  }
}
