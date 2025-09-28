import Image from 'next/image'
import React from 'react'
import img from '../public/logo.svg'
const loader = () => {
  return (
    <div className='flex items-center justify-center bg-black text-white'>
      <Image src={img} width={50} height={50}  alt='image'/>
      <h1 className='text-2xl'>Bonhive</h1>
    </div>
  )
}

export default loader
