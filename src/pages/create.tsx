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
    defaultValues: {
      condition: {
        count: 1,
      },
    },
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
      <h1 className="mb-4 text-xl font-bold">Create new Inbox</h1>

      <form
        className="flex flex-col w-full h-full p-8 px-24 py-16 mx-auto overflow-auto text-white bg-black rounded-32"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-6">
          <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
            <label className="block" htmlFor="address">
              Inbox name (all lowercase)
            </label>

            <input
              {...register("name")}
              type="text"
              className="block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="apes"
              required
            />
          </fieldset>

          <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
            <label className="block" htmlFor="address">
              Description
            </label>

            <textarea
              id="about"
              name="about"
              rows={3}
              className="block w-full mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("description")}
              required
            />
          </fieldset>

          <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
            <label className="block" htmlFor="address">
              NFT Contract Address
            </label>

            <input
              {...register("condition.nftContract")}
              type="text"
              className="block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0x1337ABE5"
              required
            />
          </fieldset>

          <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7]">
            <label className="block" htmlFor="address">
              Required NFT Count
            </label>

            <input
              {...register("condition.count")}
              type="text"
              className="block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="1"
              required
            />
          </fieldset>
        </div>

        <p className="max-w-sm mx-auto mt-10 text-sm text-center">
          Inboxes are a way to categorize your incoming messages.
          <br /> You can configure your inbox to only allow messages from token
          holders
        </p>

        <button className="px-6 mx-auto mt-10 font-bold text-white bg-green-500 border-none rounded-full py-2.5">
          Create Inbox
        </button>
      </form>
    </Layout>
  )
}
