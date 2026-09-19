import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { ISessionMetadata } from '@root/shared/types/session-metadata.type'

export const EnableTwoFactorTemplate = () => {
  return (
    <Html>
      <Head></Head>

      <Preview>Обеспечьте свою безопасность</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Защитите свой аккаунт</Heading>

            <Text className='text-base text-black'>
              Включите двухфакторную аутентификацию, чтобы повысить безопасность вашего аккаунта
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
