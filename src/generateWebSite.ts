import { throttle } from "lodash";
import OpenAI from "openai";
import { manageCache } from "./cache";
import { requestAI } from "./requestAI";
import { sha1 } from "./utils/sha1";

const pastConversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
  [];

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

      pastConversation.push({ role: "user", content: promptValue });

      showConversation(pastConversation);

      const showWebSiteThrottled = throttle(showWebSite, 2000);

      const response = await manageCache(
        await sha1(JSON.stringify(pastConversation)),
        async () => {
          let response = "";
          const stream = await requestAI(pastConversation);
          for await (const part of stream) {
            const chunck = part.choices[0]?.delta?.content || "";
            response += chunck;
            showWebSiteThrottled(response);
          }
          pastConversation.push({ role: "assistant", content: response });
          return response;
        },
      );

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

const showConversation = (
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
