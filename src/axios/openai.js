import axios from "axios";

export const askBot = async (question) => {
  const res = await axios.post(
    "https://furniture-node-js-api.vercel.app/chatbot",
    { question }
  );
  return {
    reply: res.data.reply,
    products: res.data.products,
  };
};
