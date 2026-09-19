import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { ISessionMetadata } from '@root/shared/types/session-metadata.type'

interface Props {
  domain: string
}

export const AccountDeletionTemplate = ({ domain }: Props) => {
  const registerLink = `${domain}/account/create`
  
  return (
    <Html>
      <Head></Head>

      <Preview>Аккаунт удалён</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Ваш аккаунт был полностью удалён</Heading>

            <Text className='text-base text-black'>
              Ваш аккаунт был полностью стёрт из базы данных TwitchClone. Все ваши данные и информация были удалены безвозвратно
            </Text>
          </Section>

          <Section className='bg-white text-black rounded-lg p-6 text-center mb-6'>
            <Text className='text-black'>Вы больше не будете получать уведомления в Telegram и на почту</Text>
            
            <Text className='text-black'>Если вы захотите вернуться на платформу, вы можете зарегестрироваться по следующей ссылке:</Text>
            
            <Link href={registerLink} className='inline-flex justify-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18b9ae] px-5 py-2 rounded-full'>Зарегестрироваться на TwitchClone</Link>
          </Section>

          <Section>
            <Text className='text-center text-black'>
              Спасибо, что были с нами! Мы всегда будем рады видеть вас на платформе
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
