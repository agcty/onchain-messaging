import React from "react"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import Layout from "@layout/Layout"
import { createInbox, CreateInboxParams } from "@utils/contract"

export default function Create() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<CreateInboxParams>({
    mode: "all",
    reValidateMode: "onChange",
  })

  async function onSubmit(params: CreateInboxParams) {
    try {
      await createInbox(params)
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    }
  }

  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Create a new Inbox</h1>

      <form
        className="flex flex-col w-full h-full p-8 mx-auto overflow-auto text-white bg-[#00AD67] rounded-t-3xl divide-y max-w-prose space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="p-4 text-black rounded-lg bg-[#F4EFE7]">
          <label className="block" htmlFor="address">
            Inbox name (all lowercase)
          </label>
          <input type="text" {...register("name")} />
        </fieldset>

        <fieldset className="p-4 text-black rounded-lg bg-[#F4EFE7]">
          <label className="block" htmlFor="address">
            Your text
          </label>
          <textarea {...register("description")} />
        </fieldset>

        <fieldset className="p-4 text-black rounded-lg bg-[#F4EFE7]">
          <label className="block" htmlFor="address">
            NFT Contract
          </label>
          <input type="text" {...register("condition.nftContract")} />
        </fieldset>

        <fieldset className="p-4 text-black rounded-lg bg-[#F4EFE7]">
          <label className="block" htmlFor="address">
            NFT Count
          </label>
          <input type="numer" {...register("condition.count")} />
        </fieldset>

        <p className="text-center">
          This is message is fully encrypted and immutable.
          <br /> Only the receiver will be avalaible to decrypt.
          <br /> Finally chat the way you ape, freely.
        </p>
        <button className="px-4 py-2 mx-auto text-white bg-black border-none rounded-lg">
          Send Message
        </button>
      </form>
    </Layout>
  )
}
