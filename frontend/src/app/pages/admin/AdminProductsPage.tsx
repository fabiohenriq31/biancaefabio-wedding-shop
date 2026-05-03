import { ExternalLink } from 'lucide-react';

export function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Shopping</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Produtos</h1>
        <p className="mt-2 text-[var(--wedding-text-light)]">
          A vitrine pública continua em produtos. Esta área central já está preparada para receber
          criação e edição de produtos em uma próxima etapa.
        </p>
      </div>

      <a
        href="/shopping/products"
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-white"
      >
        Ver produtos publicados
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
