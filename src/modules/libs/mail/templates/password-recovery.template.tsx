import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { ISessionMetadata } from '@root/shared/types/session-metadata.type'

interface Props {
  domain: string
  token: string
  metadata: ISessionMetadata
}

export const ResetPasswordTemplate = ({ domain, token, metadata }: Props) => {
  const resetLink = `${domain}/account/reset?token=${token}`

  return (
    <Html>
      <Head></Head>

      <Preview>Сброс пароля</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Сброс пароля</Heading>

            <Text className='text-base text-black'>
              Вы запросили сброс пароля для вашей учётной записи.
            </Text>

            <Text>
              Чтобы создать новый пароль, нажмите на ссылку ниже:
            </Text>

            <Link href={resetLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>Сбросить пароль</Link>
          </Section>

          <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
            <Heading className='text-xl font-semibold text-[#18b9ae]'>
              Информация о запросе:
            </Heading>

            <ul className='list-disc list-inside mt-2'>
              <li>Расположение: {metadata.location.country}, {metadata.location.city}</li>
              <li>ОС: {metadata.device.os}</li>
              <li>Браузер: {metadata.device.browser}</li>
              <li>IP-адрес: {metadata.ip}</li>
            </ul>
            <Text className='text-gray-600 mt-2'>
              Если вы не инициировали этот запрос, пожалуйста, игнорируйте это сообщение.
            </Text>
          </Section>

          <Section>
            <Text className='text-gray-600'>
              Если у вас есть вопросы или вы столкнулись с трудностями, не стесняйтесь обращаться в нашу службу поддержки по адресу
              <Link href='mailto:help@twitchclone.com' className='text-[#18b9ae] underline'>
                help@twitchclone.com
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
