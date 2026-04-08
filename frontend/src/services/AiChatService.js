export const fetchChatReply = async (history) => {
  const token = localStorage.getItem("tg-token");
  
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages: history.map(m => ({ role: m.role, content: m.text }))
    }),
  });

  if (!response.ok) throw new Error(response.status.toString());
  
  const data = await response.json();
  return data.reply || "No response received.";
};