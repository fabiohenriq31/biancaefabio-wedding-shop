import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { Button } from './Button';
import { Badge } from './Badge';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm border border-[var(--wedding-beige)] hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--wedding-beige)]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-[var(--wedding-text-light)]'
            }`}
          />
        </button>

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge variant="gold">Favorito dos convidados</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <Badge className="mb-2">{product.category}</Badge>
          <h3 className="text-xl mb-1 text-[var(--wedding-text)] line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-[var(--wedding-text-light)] line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl text-[var(--wedding-text)]">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(product)}
              className="px-3"
            >
              Detalhes
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(product)}
              className="gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
