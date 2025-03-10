import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";

const checkApiKey = (apiKey: string | null | undefined): apiKey is string => {
  if (apiKey === null || apiKey === undefined) {
    return false;
  }
  return apiKey.length > 100;
};

let openai: OpenAI | undefined;
const getOpenAI = () => {
  if (openai) {
    return openai;
  }
  let apiKey = window.localStorage.getItem("openai-api-key");
  if (!checkApiKey(apiKey)) {
    apiKey = window.prompt(
      "Entrer une clé openai. Cette clé ne sera jamais envoyée sur internet et restera dans le localstorage du navigateur internet.",
    );
    if (!checkApiKey(apiKey)) {
      throw new Error("No API key provided.");
    }
    window.localStorage.setItem("openai-api-key", apiKey);
  }
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
  return openai;
};

export const requestAI = async (
  conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> => {
  const openai = getOpenAI();

  console.log("start to send request to openai...");

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Tu generes des sites web.
Tes réponses sont en code HTML seulement.
Utilises du CSS avec des classes TailwindCSS.
Ajoute un lien vers le CDN de TailwindCSS.
Si tu ajoutes des images, utilise toujours le même lien https://cdn.shopify.com/s/files/1/1931/4545/collections/la-photo-de-montagne-paysages-des-alpes-mont-blanc-oisans-647613.jpg?v=1642220795.
Enleves les lignes avec \`\`\`.
`,
      },
      ...conversation,
    ],
    store: true,
    stream: true,
  });

  return stream;
};
