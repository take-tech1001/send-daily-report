import '@/style.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { removeDabbleQuote } from '@utils'
import { useEffect, useState } from 'react'
import { Button, Input } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Storage } from '@plasmohq/storage'

const schema = z
  .object({
    token: z.string().min(1, { message: 'トークンを入力してください。' }),
    myName: z.string().min(1, { message: '名前を入力してください。' }),
    channelID: z.string().min(1, {
      message: '日報を投稿するチャンネルのチャンネルIDを入力してください。'
    }),
    timesChannelID: z.string(),
    timeDesignerToken: z.string()
  })
  .transform((v) => {
    if (v.token.indexOf('Bearer') === -1) {
      v.token = `Bearer ${v.token}`
    }

    return v
  })

type FormInput = z.infer<typeof schema>

const storage = new Storage()

const Options = () => {
  const [token, setToken] = useState('')
  const [myName, setMyName] = useState('')
  const [channelID, setChannelID] = useState('')
  const [timesChannelID, setTimesChannelID] = useState('')
  const [timeDesignerToken, setTimeDesignerToken] = useState('')

  const setStorage = async (key: string, value: string) => {
    await storage.set(key, value)
  }

  chrome.storage.sync
    .get([
      'token',
      'myName',
      'channelID',
      'timesChannelID',
      'toggl',
      'timeDesignerToken'
    ])
    .then((result) => {
      !!result.token && setToken(removeDabbleQuote(result.token))
      !!result.myName && setMyName(removeDabbleQuote(result.myName))
      !!result.channelID && setChannelID(removeDabbleQuote(result.channelID))
      !!result.timesChannelID &&
        setTimesChannelID(removeDabbleQuote(result.timesChannelID))
      !!result.timeDesignerToken &&
        setTimeDesignerToken(removeDabbleQuote(result.timeDesignerToken))
    })

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
    timeDesignerToken
  }: FormInput) => {
    await setStorage('token', token)
    await setStorage('myName', myName)
    await setStorage('channelID', channelID)
    await setStorage('timesChannelID', timesChannelID)
    await setStorage('timeDesignerToken', timeDesignerToken)

    alert('保存しました')
  }

  useEffect(() => {
    reset({
      token,
      myName,
      channelID,
      timesChannelID,
      timeDesignerToken
    })
  }, [token, myName, channelID, timesChannelID, timeDesignerToken])

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
            time designerのAPIトークン（任意）
          </label>
          <Input
            id="toggl"
            type="text"
            className="relative transition-all mt-[5px] py-3 px-2"
            {...register('timeDesignerToken')}
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
