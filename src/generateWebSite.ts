import { throttle } from "lodash";
import { manageCache } from "./cache";
import { conversation, showConversation } from "./conversation";
import { requestAI } from "./requestAI";
import { sha1 } from "./utils/sha1";

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

      conversation.push({ role: "user", content: promptValue });

      showConversation(conversation);

      const showWebSiteThrottled = throttle(showWebSite, 2000);

      const response = await manageCache(
        await sha1(JSON.stringify(conversation)),
        async () => {
          let response = "";
          const stream = await requestAI(conversation);
          for await (const part of stream) {
            const chunck = part.choices[0]?.delta?.content || "";
            response += chunck;
            showWebSiteThrottled(response);
          }
          return response;
        },
      );

      conversation.push({ role: "assistant", content: response });

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
