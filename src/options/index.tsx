import '@/style.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Button, Input } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useStorage } from '@plasmohq/storage/hook'

const schema = z.object({
  token: z.string().min(1, { message: 'トークンを入力してください。' }),
  myName: z.string().min(1, { message: '名前を入力してください。' }),
  channelID: z.string().min(1, {
    message: '日報を投稿するチャンネルのチャンネルIDを入力してください。'
  }),
  timesChannelID: z.string(),
  toggl: z.string()
})

type FormInput = z.infer<typeof schema>

const Options = () => {
  const [token, setToken] = useStorage('token', '')
  const [myName, setMyName] = useStorage('myName', '')
  const [channelID, setChannelID] = useStorage('channelID', '')
  const [timesChannelID, setTimesChannelID] = useStorage('timesChannelID', '')
  const [toggl, setToggl] = useStorage('toggl', '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInput>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  })

  const handleRegister = async ({
    token,
    myName,
    channelID,
    timesChannelID,
    toggl
  }: FormInput) => {
    if (token.indexOf('Bearer') === -1) {
      token = `Bearer ${token}`
    }

    token && setToken(token)
    myName && setMyName(myName)
    channelID && setChannelID(channelID)
    timesChannelID && setTimesChannelID(timesChannelID)
    toggl && setToggl(toggl)

    alert('保存しました')
  }

  useEffect(() => {
    reset({ token, myName, channelID, timesChannelID, toggl })
  }, [token, myName, channelID, timesChannelID, toggl])

  return (
    <form onSubmit={handleSubmit((d) => handleRegister(d))} className="">
      <div className="my-8">
        <h1 className="font-bold text-[30px]">設定</h1>
        <p className="text-[15px]">
          SlackのToken・チャンネルID・自分の名前を登録してください
        </p>

        <div className="flex flex-col mt-8">
          <label htmlFor="token" className="text-[14px]">
            SlackのToken
          </label>
          <Input
            id="token"
            type="text"
            placeholder="xoxp-xxxxx"
            className="relative transition-all mt-[5px] py-3 px-2"
            {...register('token')}
          />
          {errors.token?.message && (
            <p className="text-red-600 text-[13px]">
              {String(errors.token.message)}
            </p>
          )}
        </div>
        <div className="mt-[20px] flex flex-col">
          <label htmlFor="myName" className="text-[14px]">
            名前
          </label>
          <Input
            id="myName"
            type="text"
            placeholder="名前"
            className="relative transition-all mt-[5px] py-3 px-2"
            {...register('myName')}
          />
          {errors.myName?.message && (
            <p className="text-red-600 text-[13px]">
              {String(errors.myName.message)}
            </p>
          )}
        </div>
        <div className="mt-[20px] flex flex-col">
          <label htmlFor="channelID" className="text-[14px]">
            日報を投稿するチャンネルのチャンネルID
          </label>
          <Input
            id="channelID"
            type="text"
            placeholder="C0000AAA0AA"
            className="relative transition-all mt-[5px] py-3 px-2"
            {...register('channelID')}
          />
          {errors.channelID?.message && (
            <p className="text-red-600 text-[13px]">
              {String(errors.channelID.message)}
            </p>
          )}
        </div>
        <div className="mt-[20px] flex flex-col">
          <label htmlFor="timesChannelID" className="text-[14px]">
            timesを投稿するチャンネルのチャンネルID（任意）
          </label>
          <Input
            id="timesChannelID"
            type="text"
            placeholder="C0000AAA0AA"
            className="relative transition-all mt-[5px] py-3 px-2"
            {...register('timesChannelID')}
          />
        </div>
        <div className="mt-[20px] flex flex-col">
          <label htmlFor="toggl" className="text-[14px]">
            togglのAPIトークン（任意）
          </label>
          <Input
            id="toggl"
            type="text"
            className="relative transition-all mt-[5px] py-3 px-2"
            {...register('toggl')}
          />
        </div>

        <div className="mt-[20px] flex justify-center">
          <Button
            type="submit"
            className="rounded-[25px] py-2 px-[30px] cursor-pointer"
            color="primary">
            保存する
          </Button>
        </div>
      </div>
    </form>
  )
}

export default Options
