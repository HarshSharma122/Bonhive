import React from 'react'
import dynamic from 'next/dynamic'
const Calender = dynamic(()=>import("@/utilis/calender"))

const page = () => {
  return (
    <Calender/>
  )
}

export default page
