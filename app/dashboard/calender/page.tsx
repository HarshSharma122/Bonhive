"use client"

import React from 'react'
import dynamic from 'next/dynamic'
const Calender = dynamic(()=>import("@/utilis/calender"), {
  ssr:false
})

const page = () => {
  return (
    <Calender/>
  )
}

export default page
