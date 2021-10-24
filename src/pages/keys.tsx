import React, { useEffect } from "react"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { useMetamask } from "@hooks/useMetamask"
import Layout from "@layout/Layout"
import { addPublicKey, getPublicKey } from "@utils/contract"

interface Fields {
  publicKey: string
}

export default function Keys() {
  const { accounts } = useMetamask()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid, isSubmitting },
  } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
  })

  useEffect(() => {
    async function call() {
      const pubKey = await getPublicKey(accounts[0])

      if (pubKey) {
        reset({ publicKey: pubKey })
      }
    }

    call()
  }, [accounts, reset])

  async function onSubmit({ publicKey }: Fields) {
    try {
      await addPublicKey(publicKey)
      toast.success("Your public key was updated!")
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <h1 className="mb-4 text-xl font-bold">Add a public key</h1>

        <form
          className="flex flex-col w-full h-full p-8 px-24 py-16 mx-auto overflow-auto text-white bg-gray-500 min-w-[800px] rounded-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <fieldset className="p-4 text-black rounded-xl bg-[#F4EFE7] space-y-2">
              <div>
                <label className="block font-semibold" htmlFor="address">
                  Your Public Key
                </label>
                <p className="text-xs text-gray-500">
                  This key will be used to encrypt messages directed to you so
                  only you will be able to read them.
                </p>
              </div>

              <div className="flex space-x-2">
                <input
                  {...register("publicKey", { required: true })}
                  type="text"
                  className="flex-1 block w-full py-2 mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
                <button
                  type="button"
                  className="block px-4 py-2 mt-1 font-semibold text-white bg-green-500 rounded-lg hover:opacity-80 transition-opacity shadow-sm sm:text-sm"
                  onClick={async () => {
                    const publicKey = await window["ethereum"].request({
                      method: "eth_getEncryptionPublicKey",
                      params: [accounts[0]],
                    })
                    setValue("publicKey", publicKey, { shouldValidate: true })
                  }}
                >
                  Get Key from Wallet
                </button>
              </div>
            </fieldset>
          </div>

          <p className="max-w-xs mx-auto mt-10 text-sm text-center">
            Don't worry, your public encryption key cannot be used to steal your
            precious apes and punks. We just need it to encrypt your inbox.
          </p>

          <button
            className="px-6 mx-auto mt-10 font-bold text-white bg-black border-none rounded-full py-2.5"
            disabled={!isValid || isSubmitting}
          >
            Add Public Key
          </button>
        </form>
      </div>
    </Layout>
  )
}
