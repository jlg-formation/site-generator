export const generateWebSite = () => {
  const form = document.querySelector(".generate-website") as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const promptValue = data.prompt || "Fais moi un site d'agence d'architecte";
    console.log("promptValue: ", promptValue);
  });
};
