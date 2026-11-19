/**
 * Webhook integrations: Discord and Telegram notifications (read-only alerts).
 */
export interface WebhookConfig {
  discordUrl?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}

export async function sendDiscord(url: string, message: string): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendTelegram(token: string, chatId: string, message: string): Promise<boolean> {
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function notifyAll(cfg: WebhookConfig, message: string): Promise<void> {
  const tasks: Promise<boolean>[] = [];
  if (cfg.discordUrl) tasks.push(sendDiscord(cfg.discordUrl, message));
  if (cfg.telegramBotToken && cfg.telegramChatId) tasks.push(sendTelegram(cfg.telegramBotToken, cfg.telegramChatId, message));
  await Promise.allSettled(tasks);
}
