import { Markup } from "telegraf";

export const BUTTONS = {
  authSuccess: Markup.inlineKeyboard([
    [
      Markup.button.callback('📜 Мои подписки', 'followings'),
      Markup.button.callback('👤 Просмотреть профиль', 'me'),
    ],
    [Markup.button.url('🌐 На сайт', 'https://teastream.ru')]
  ]),

  profile: Markup.inlineKeyboard([
    Markup.button.url('⚙️ Настройки аккаунта', 'https://teastream.ru/dashboard/settings')
  ])
}