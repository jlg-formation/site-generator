import OpenAI from "openai";

export const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
  [];

export const showConversation = (
  conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
) => {
  const conversationElement = document.querySelector(
    ".conversation",
  ) as HTMLElement;
  conversationElement.innerHTML = "";
  conversation
    .filter((c) => c.role === "user")
    .forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = message.content as string;
      conversationElement.appendChild(messageElement);
    });
};
