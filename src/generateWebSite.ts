import { throttle } from "lodash";
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

      const showWebSiteThrottled = throttle(showWebSite, 2000);

      const response = await manageCache(promptValue, async () => {
        let response = "";
        const stream = await requestAI(promptValue);
        for await (const part of stream) {
          const chunck = part.choices[0]?.delta?.content || "";
          response += chunck;
          showWebSiteThrottled(response);
        }
        return response;
      });

      showWebSiteThrottled(response);
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
