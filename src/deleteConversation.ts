import { pastConversation, showConversation } from "./generateWebSite";

export const setupDeleteConversation = () => {
  const btn = document.querySelector(
    ".delete-conversation",
  ) as HTMLButtonElement;

  btn.addEventListener("click", () => {
    console.log("remove conversation");
    pastConversation.splice(0, pastConversation.length);
    showConversation(pastConversation);
  });
};
