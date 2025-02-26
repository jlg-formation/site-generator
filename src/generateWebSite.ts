import { requestAI } from "./requestAI";

export const generateWebSite = () => {
  const form = document.querySelector(".generate-website") as HTMLFormElement;
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const promptValue =
        (data.prompt as string) || "Fais moi un site d'agence d'architecte";
      console.log("promptValue: ", promptValue);

      await requestAI(promptValue);
    } catch (err) {
      console.log("err: ", err);
      if (err instanceof Error) {
        alert("Une erreur est survenue : " + err.message);
      }
    }
  });
};
