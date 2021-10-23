import React from "react"

import { ArrowSmRightIcon } from "@heroicons/react/solid"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { send } from "@utils/contract"

interface Fields {
  message: string
}

export function SendForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
  })

  async function onSubmit({ message }: Fields) {
    console.log(message)

    try {
      await send(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        message,
        "default"
      )

      reset({ message: "" })
    } catch (e) {
      console.error(e)

      toast(e.message)
    }
  }

  return (
    <form className="flex" onSubmit={handleSubmit(onSubmit)}>
      <input
        disabled={isSubmitting}
        className="flex-1 px-8 py-4 border-none"
        type="text"
        placeholder="Enter your message…"
        {...register("message", { required: true })}
      />

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="p-4"
        title="Send message"
      >
        <ArrowSmRightIcon className="w-8 h-8" />
      </button>
    </form>
  )
}
