import { Card } from "@/components/ui/card";
import ProductDetailsModal from "./ProductDetailsModal";
import { Product } from '@/data/menuData';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <ProductDetailsModal product={product}>
      <Card className="overflow-hidden bg-product-card border-border hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div className="relative h-40 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-product-overlay" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground mb-2 text-sm uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="text-primary font-bold text-lg">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </Card>
    </ProductDetailsModal>
  );
};

export default ProductCard;