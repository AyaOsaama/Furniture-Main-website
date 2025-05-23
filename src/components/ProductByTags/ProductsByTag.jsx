import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../axios/axios";
import ProductGrid from "../products/ProductGrid";

export default function ProductsByTag() {
    const { tagName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/products/tag/${tagName}`);
                setProducts(response.data);
            } catch (err) {
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [tagName]);

    return (
        <div className="container mx-auto my-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-primary text-center">
                Products related to "{tagName}"
            </h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No products found for this tag.</p>
            ) : (
                <ProductGrid
                    hasLoaded={true}
                    currentVariants={products.flatMap(p => p.variants.map(v => ({
                        ...v,
                        productId: p._id,
                        product: p,
                    })))}
                    filteredVariants={products.flatMap(p => p.variants.map(v => ({
                        ...v,
                        productId: p._id,
                        product: p,
                    })))}
                    resetFilters={() => {}}
                />
            )}
        </div>
    );
}
