import React from "react"

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import { ethers } from "ethers"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useQuery } from "react-query"

import Layout from "@layout/Layout"
import { getPublicKey, send } from "@utils/contract"

export default function Send() {
  interface Fields {
    message: string
    inbox: string
    address: string
  }

  const { register, handleSubmit, reset, watch } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      inbox: "default",
    },
  })

  async function onSubmit({ message, address, inbox }: Fields) {
    try {
      const provider = ethers.getDefaultProvider()
      const recipient = await provider.resolveName(address)

      await send(recipient, message, inbox)

      reset({ message: "", address: "" })
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    }
  }

  const recipient = watch("address")

  const { data: pubKey, isLoading: pubKeyLoading } = useQuery(
    ["getPublicKey", recipient],
    async () => {
      const provider = ethers.getDefaultProvider()
      const address = await provider.resolveName(recipient)

      return getPublicKey(address)
    },
    {
      enabled:
        !!recipient?.match(/.*\.eth$/) || ethers.utils.isAddress(recipient),
    }
  )

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <h1 className="mb-4 text-xl font-bold">Send a message</h1>

        <form
          className="flex flex-col w-full h-full max-w-xl p-8 px-24 py-16 mx-auto overflow-auto text-white bg-green-500 min-w-[800px] rounded-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
              <label className="block font-semibold" htmlFor="address">
                Recipient address
              </label>

              <input
                {...register("address", { required: true })}
                type="text"
                className="block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="apecollector.eth"
                required
              />
            </fieldset>

            <div className="p-4 text-black rounded-xl bg-[#F4EFE7] space-y-2">
              <p className="block font-semibold">Encryption Status</p>
              <p className="font-bold">
                {pubKeyLoading ? (
                  `Waiting…`
                ) : !!pubKey ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon className="inline-block w-8 h-8 text-green-400" />{" "}
                    <div>
                      Fully Encrypted using public key{" "}
                      <code className="text-sm">{pubKey}</code>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <XCircleIcon className="inline-block w-8 h-8 text-red-500" />
                    <div>Not encrypted!</div>
                  </div>
                )}
              </p>
            </div>

            <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
              <label className="block font-semibold" htmlFor="address">
                Inbox
              </label>

              <input
                {...register("inbox", { required: true })}
                type="text"
                className="block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="apes"
                required
              />
            </fieldset>

            <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
              <label className="block font-semibold" htmlFor="address">
                Your text
              </label>

              <textarea
                id="message"
                name="message"
                rows={3}
                className="block w-full mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                {...register("message", { required: true })}
                required
              />
            </fieldset>
          </div>

          <p className="mt-10 text-sm text-center">
            This is message is fully encrypted and immutable.
            <br /> Only the receiver will be avalaible to decrypt.
            <br /> Finally chat the way you ape, freely.
          </p>

          <button className="px-6 mx-auto mt-10 font-bold text-white bg-black border-none rounded-full py-2.5">
            Send Message
          </button>
        </form>
      </div>
    </Layout>
  )
}
