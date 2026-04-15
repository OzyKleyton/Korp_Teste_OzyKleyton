export interface NotaFiscalItem {
  id: number;
  produto_id: number;
  quantidade: number;
}

export interface NotaFiscal {
  id: number;
  numero_sequencial: number;
  status: string;
  itens: NotaFiscalItem[];
  created_at: string;
}
