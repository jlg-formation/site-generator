import { manageCache } from "./cache";
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

      const response = await manageCache(promptValue, async () => {
        let response = "";
        const stream = await requestAI(promptValue);
        for await (const part of stream) {
          const chunck = part.choices[0]?.delta?.content || "";
          console.log("chunck: ", chunck);
          response += chunck;
          showWebSite(response);
        }
        return response;
      });

      showWebSite(response);
    } catch (err) {
      console.log("err: ", err);
      if (err instanceof Error) {
        alert("Une erreur est survenue : " + err.message);
      }
    }
  });
};

const showWebSite = (response: string) => {
  const iframe = document.querySelector("iframe") as HTMLIFrameElement;
  iframe.srcdoc = response;
};
