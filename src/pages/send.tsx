import React from "react"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import Layout from "@layout/Layout"
import { send } from "@utils/contract"

export default function Send() {
  interface Fields {
    message: string
    address: string
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
  })

  async function onSubmit({ message, address }: Fields) {
    try {
      await send(address, message, "default")
      reset({ message: "", address: "" })
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <h1 className="mb-4 text-xl font-bold">Send a message</h1>

        <form
          className="flex flex-col w-full h-full p-8 px-24 py-16 mx-auto overflow-auto text-white bg-green-500 min-w-[800px] rounded-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
              <label className="block font-semibold" htmlFor="address">
                Recipient address
              </label>

              <input
                {...register("address")}
                type="text"
                className="block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="apes"
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
                {...register("message")}
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
