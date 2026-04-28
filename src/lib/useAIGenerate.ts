import { useState } from "react";
import { useUser } from "./user";
import { Profile } from "./products";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export interface AIGeneratedBox {
  packName: string;
  description: string;
  totalEstimatedCost: number;
  currency: string;
  items: Array<{
    name: string;
    category: string;
    price: number;
    reason: string;
  }>;
  profile: Profile;
  generatedAt: string;
}

export const useAIGenerate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const generateBox = async (profile: Profile): Promise<AIGeneratedBox | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        setError("You must be logged in to generate a study box");
        return null;
      }

      const token = sessionStorage.getItem("studybox.token");
      if (!token) {
        setError("Authentication token not found");
        return null;
      }

      const response = await fetch(`${API_URL}/api/packs/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: profile.field,
          level: profile.level,
          goal: profile.goal,
          studyStyle: profile.style,
          budget: profile.budget || 150,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate study box");
      }

      const responseData = await response.json();
      
      if (!responseData.success || !responseData.generatedPack) {
        throw new Error("Invalid response format from server");
      }

      return responseData.generatedPack as AIGeneratedBox;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      console.error("AI Generation Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateBox, loading, error };
};
