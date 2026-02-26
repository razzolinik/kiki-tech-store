import { useState, useEffect } from "react";
import { getImage } from "@/utils/imageMap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useProducts(category?: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = category && category !== "Todos"
      ? `${API_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${API_URL}/api/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p: any) => ({
          ...p,
          image: getImage(p.image),
          images: p.images?.map((img: string) => getImage(img)) ?? [getImage(p.image)],
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          ...data,
          image: getImage(data.image),
          images: data.images?.map((img: string) => getImage(img)) ?? [getImage(data.image)],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { product, loading, error };
}