import OpenAI from "openai";

let openai: OpenAI | undefined;
const getOpenAI = () => {
  if (openai) {
    return openai;
  }
  let apiKey = window.localStorage.getItem("openai-api-key");
  if (apiKey === null) {
    apiKey = window.prompt(
      "Enter your OpenAI API key. This will be stored in your browser localstorage and never sent anywhere.",
    );
    if (apiKey === null) {
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

export const requestAI = async (promptValue: string) => {
  const openai = getOpenAI();

  console.log("start to send request to openai...");
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Donne une reponse tres courte : une phrase maximum.",
      },
      {
        role: "user",
        content: promptValue,
      },
    ],
    store: true,
  });

  console.log(completion.choices[0].message);
  const response = completion.choices[0].message.content;
  console.log("response: ", response);
  return response;
};
