export const setupDeleteConversation = () => {
  const btn = document.querySelector(
    ".delete-conversation",
  ) as HTMLButtonElement;

  btn.addEventListener("click", () => {
    console.log("remove conversation");
    const conversationElt = document.querySelector(
      ".conversation",
    ) as HTMLElement;
    conversationElt.innerHTML = "";
  });
};
