import React from "react"

import Layout from "@layout/Layout"

export default function Send() {
  return (
    <Layout>
      <div className="flex flex-col w-auto h-full mx-auto max-w-prose">
        <h1 className="mb-4 text-xl font-bold">Send a message.</h1>
        <form className="flex flex-col w-full h-full p-8 mx-auto overflow-auto text-white bg-[#00AD67] rounded-t-3xl divide-y max-w-prose space-y-4">
          <fieldset className="p-4 text-black rounded-lg bg-[#F4EFE7]">
            <label className="block" htmlFor="address">
              Recipient address
            </label>
            <input type="text" />
          </fieldset>
          <fieldset className="p-4 text-black rounded-lg bg-[#F4EFE7]">
            <label className="block" htmlFor="address">
              Your text
            </label>
            <textarea />
          </fieldset>
          <p className="text-center ">
            This is message is fully encrypted and immutable.
            <br /> Only the receiver will be avalaible to decrypt.
            <br /> Finally chat the way you ape, freely.
          </p>
          <button className="px-4 py-2 mx-auto text-white bg-black border-none rounded-lg">
            Send Message
          </button>
        </form>
      </div>
    </Layout>
  )
}
