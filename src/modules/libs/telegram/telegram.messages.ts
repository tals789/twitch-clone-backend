import { SponsorshipPlan, User } from "@prisma/prisma/client";
import { ISessionMetadata } from "@root/shared/types/session-metadata.type";

export const MESSAGES = {
  welcome: `<b>👋 Добро пожаловать в TwitchCloneBot!</b>\n\n` + `Чтобы получать уведомления и улучшить ваш опыт использования платформы, давайте свяжем ваш Telegram аккаунт с TwitchClone.\n\n` + `Нажмите кнопку ниже и перейдите в раздел <b>Уведомления</b>, чтобы завершить настройку.`,
  authSuccess: `🎉 Вы успешно авторизовались и Telegram аккаунт связан с TwitchClone!\n\n`,
  invalidToken: '❌ Недействительный или просроченный токен.',
  profile: (user: User, followersCount: number) => 
    `<b>👤 Профиль пользователя:</b>\n\n` +
    `👤 Имя пользователя: <b>${user.username}</b>\n` +
    `📧 Email: <b>${user.email}</b>\n` +
    `👥 Количество подписчиков: <b>${followersCount}</b>\n` +
    `📝 О себе: <b>${user.bio || 'Не указано'}</b>\n\n` +
    `🔧 Нажмите на кнопку ниже, чтобы перейти к настройкам профиля.`,
  follows: (user: User) => `📺 <a href='https://teastream.ru/${user.username}'>${user.username}</a>`,
  resetPassword: (token: string, metadata: ISessionMetadata) => 
    `<b>🔒 Сброс пароля</b>\n\n` +
    `Вы запросили сброс пароля для вашей учётной записи на платформе <b>TwitchClone</b>\n\n` +
    `Чтобы создать новый пароль, пожалуйста, перейдите по следующей ссылке:\n\n` +
    `<b><a href='https://teastream.ru/account/recovery/${token}'>Сбросить пароль</a></b>\n\n` +
    `📅 <b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
    `📅 <b>Информация о запросе:</b>\n\n` +
    `🌍 <b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
    `📱 <b>ОС:</b> ${metadata.device.os}` +
    `🌐 <b>Браузер:</b> ${metadata.device.browser}\n` +
    `💻 <b>IP-адрес:</b> ${metadata.ip}\n\n` +
    `Если вы не делали этот запрос, просто проигнорируйте это сообщение.\n\n` +
    `Спасибо за использование <b>TwitchClone</b>! 🚀`,
  deactivate: (token: string) => `Код подтверждения ${token}`,
  accountDeleted: `Ваш аккаунт был полностью удалён`,
  streamStart: (channel: User) => `На канале ${channel.username} началась трансляция!\n\n`,
  newFollowing: (follower: User, followersCount: number) => `У вас новый подписчик, это пользователь ${follower.displayName}. Итоговое количество подписчиков на вашем канале: ${followersCount}`,
  newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
    `<b>Новое спонсортство!</b>\n\n` + 
    `Вы получили новое спонсорство на план ${plan.title}\n` +
    `Сумма: ${plan.price} ₽\n` +
    `Спонсор: ${sponsor.username}` +
    `Дата оформления: ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n`,
  enableTwoFactor: `Включите двухфакторную аутентификацию`,
  vefifyChannel: `Поздравляем! Ваш канал верифицирован, и вы получили официальный значок`
}