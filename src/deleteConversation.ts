import { conversation, showConversation } from "./conversation";

export const setupDeleteConversation = () => {
  const btn = document.querySelector(
    ".delete-conversation",
  ) as HTMLButtonElement;

  btn.addEventListener("click", () => {
    console.log("remove conversation");
    conversation.splice(0, conversation.length);
    showConversation(conversation);
  });
};
