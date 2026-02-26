import { useState, useEffect } from "react";
import { getImage } from "@/utils/imageMap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/collections`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((c: any) => ({
          ...c,
          coverImage: getImage(c.coverImage),
        }));
        setCollections(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { collections, loading, error };
}

export function useCollection(id: string) {
  const [collection, setCollection] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/collections/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCollection({
          ...data,
          coverImage: getImage(data.coverImage),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { collection, loading, error };
}