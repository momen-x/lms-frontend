const AI_CHAT_PREFIX = "lms:ai-chat";

export function clearUserAiChats(userId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const userPrefix = `${AI_CHAT_PREFIX}:${userId}:`;

  const keysToDelete: string[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith(userPrefix)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => {
    localStorage.removeItem(key);
  });
}
