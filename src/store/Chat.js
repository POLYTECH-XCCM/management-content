import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [
    {
      text: "Bienvenue sur le chat, comment puis-je vous aider?",
      sender: "ai",
    },
  ],
  addMessage: (text, sender) =>
    set((state) => ({ messages: [...state.messages, { text, sender }] })),
}));
