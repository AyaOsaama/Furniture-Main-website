import axios from "axios";

export const askBot = async (question) => {
  const res = await axios.post("https://furniture-nodejs-production-665a.up.railway.app/chatbot", { question });
  return {
    reply: res.data.reply,
    products: res.data.products,
  };
};
