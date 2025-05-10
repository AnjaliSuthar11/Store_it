import React from 'react'
import Image from 'next/image'
const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
      <section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5 '>
        <div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>

            <div className='logo flex flex-row'>
            <Image src="/logo1.png" alt="logo" width={60} height={60} className='h-auto mr-1' /> 
            <h1 className='h1 text-white justify-center flex items-center font-serif'> Store it</h1> 
            </div>

            <div className='space-y-5 text-white'>
                <h1 className='h1'>
            Manage your files the best way
                </h1>
                <p className='body-1'>
                    This is a place where you can store all your documents
                </p>
            </div>
            <Image src="/illustration.png" alt='files' width={342} height={342} className='transition-all hover:rotate-2 hover:scale-105' />
        </div>
      </section>
      <section className='flex-1 flex flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
        <div className='mb-16 lg:hidden'>
            <Image src="/logo1.png" alt='logo' width={60} height={60} className='h-auto w-[200px] lg:w-[250px]'/>
        </div>
        {children}
      </section>
    </div>
  )
}

export default layout
