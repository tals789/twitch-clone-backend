import * as React from 'react'
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

export const VerifyChannelTemplate = () => {
  return (
    <Html>
      <Head></Head>

      <Preview>Ваш канал верифицирован</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Поздравляем ваш канал верифицирован</Heading>

            <Text className='text-base text-black'>
              Мы рады сообщить, что ваш канал теперь верифицирован и вы получили официальный значок
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
