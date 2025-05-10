"use client"
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { avatarPlaceholderUrl, navItem } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

interface Props{
  fullName:string,
  avatar:string,
  email:string
}

const Sidebar = ({fullName , avatar,email}:Props) => {

  const pathname = usePathname();
  return (
    <aside className='sidebar'>
        <Link href="/">
                <div className='flex flex-row justify-center items-center'>
                    <Image src="/logo2.png" alt="logo" width={60} height={60} className='hidden h-auto lg:block' /> 
                    <h1 className='h1 font-serif ml-1 hidden h-auto lg:block'>Store it</h1>
                </div>
                <Image src="/logo2.png" alt='logo' width={52} height={52} className='lg:hidden'/>
        </Link>
        <nav className='sidebar-nav'>
            <ul className='flex flex-1 flex-col gap-6'>
              {navItem.map(({icon,url,name})=>(
                <Link href={url} key={name} className='lg:w-full'>
                  <li className={cn("sidebar-nav-item",pathname===url && "shad-active")}>
                    <Image 
                       src={icon} 
                       alt={name} 
                       width={25} 
                       height={25}
                       className={cn("nav-icon",pathname===url && "nav-icon-active")}/>
                    <p className='hidden lg:block'>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
        </nav>
        <Image src="/illustration.png" alt='logo' width={506} height={418} className='w-full'/>
        <div className='sidebar-user-info'>
          <Image src={avatarPlaceholderUrl} alt='Avatar' width={44} height={44} className='sidebar-user-avatar'/>
          <div className='hidden lg:block'>
            <p className='subtitle-2 capitalize'>{fullName}</p>
            <p className='caption'>{email}</p>
          </div>
        </div>
    </aside>
  )
}

export default Sidebar
