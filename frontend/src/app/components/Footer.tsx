import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--wedding-beige)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl mb-3 text-[var(--wedding-text)]">
              Bianca & Fábio
            </h3>
            <p className="text-sm text-[var(--wedding-text-light)]">
              Criamos esta lista de presentes simbólicos para que você possa fazer parte da nossa nova história de uma forma especial e carinhosa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm mb-3 text-[var(--wedding-text)]">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/shopping"
                  className="text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)] transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="/shopping/products"
                  className="text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)] transition-colors"
                >
                  Presentes
                </a>
              </li>
              <li>
                <a
                  href="https://biancaefabio.com.br"
                  className="text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)] transition-colors"
                >
                  Site do casamento
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm mb-3 text-[var(--wedding-text)]">
              Contato
            </h4>
            <p className="text-sm text-[var(--wedding-text-light)]">
              Dúvidas sobre os presentes?<br />
              Entre em contato conosco:<br />
              <a
                href="mailto:contato@biancaefabio.com.br"
                className="text-[var(--wedding-gold)] hover:underline"
              >
                contato@biancaefabio.com.br
              </a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--wedding-beige)]">
          <p className="text-center text-sm text-[var(--wedding-text-light)] flex items-center justify-center gap-2">
            Feito com <Heart className="w-4 h-4 fill-current text-[var(--wedding-gold)]" /> para nosso dia especial
          </p>
        </div>
      </div>
    </footer>
  );
}
