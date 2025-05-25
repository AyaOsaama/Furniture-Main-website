import { useState, useEffect } from 'react';

const useCart = (product, selectedVariant) => {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = product?.variants[selectedVariant]?.inStock || 10;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    if (!product) return;

    const variant = product.variants[selectedVariant];
    const existingItemIndex = cart.findIndex(
      item => item.productId === product._id && item.variantId === variant._id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      const newItem = {
        productId: product._id,
        variantId: variant._id,
        name: variant.name?.en || product.name?.en || "Product",
        image: variant.images?.[0] || variant.image || "/placeholder.jpg",
        price: variant.discountPrice || variant.price,
        originalPrice: variant.price,
        color: variant.color?.en || "N/A",
        quantity: quantity,
        maxQuantity: variant.inStock,
      };
      setCart([...cart, newItem]);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return {
    quantity,
    handleQuantityChange,
    addToCart,
    toggleWishlist,
    isWishlisted
  };
};

export default useCart;