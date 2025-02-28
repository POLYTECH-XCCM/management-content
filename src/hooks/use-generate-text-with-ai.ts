import { useState } from "react";

export const useGenerateTextWithAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const generateTextWithAI = (textRequest: string) => {
    setIsLoading(true);
    setIsError(false);

    return fetch("/api/chat", {
      method: "POST",
      body: textRequest,
    })
      .then((response) => {
        setIsError(false);
        return response.json();
      })
      .then((result) => result.text as string)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  return { isLoading, isError, generateTextWithAI };
};
