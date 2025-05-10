"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { FileDetails,ShareInput } from './ActionsModalContent'
import { actionsDropdownItems } from '@/constants'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Models } from 'node-appwrite'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'


const ActionDropdown = ({file,}:{file:Models.Document}) => {
    const [isModalOpen,setIsModelOpen] = useState(false);
    const [isDropdownOpen,setIsDropdownOpen]=useState(false);
    const [action,setAction]=useState<ActionType |null>(null);
    const [name,setName]=useState(file.name);
    const [isLoading,setIsLoading]=useState(false);
    const path=usePathname()
    const [emails,setEmails]=useState<string[]>([])

    const closeAllModals=()=>{
      setIsModelOpen(false);
      setIsDropdownOpen(false);
      setAction(null);
      setName(file.name);
    }
    const handleAction=async()=>{
      if(!action) return;
      setIsLoading(true);
      let success=false;
try{
      const actions={
        rename:()=>renameFile({fileId:file.$id,name,extension:file.extension,path}),
        share:()=>updateFileUsers({fileId:file.$id,emails,path}),
        delete:()=>deleteFile({fileId:file.$id,path,bucketFileId:file.bucketFileId}),

      };
      success=await actions[action.value as keyof typeof actions]();
    }
    catch(error){
      console.log("Action Failed",error)
    }
    finally{
      setIsLoading(false);
      closeAllModals();
      window.location.reload();
    }
      // if(success) closeAllModals();
      // setIsLoading(false)
    }

  const handleRemoveUser= async (email:string)=>{
      const updatedEmails = emails.filter((e)=>e != email);
      try{
       
      const success=await updateFileUsers({
        fileId:file.$id,
        emails:updatedEmails,
        path})

        if(success) setEmails(updatedEmails);
        // closeAllModals();
      }
      catch(error){
        console.log("failed to remove users:",error);
      }finally{
        closeAllModals();
        window.location.reload();
      }
  }
  const renderDialogContent= ()=>{
    if(!action) return null;
    const {value,label}=action;

      return <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>
            {label}
          </DialogTitle>
          {value==="rename"&& (
            <Input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>
        )}
        {value === "details" && <FileDetails file={file}/>
        }
        {value === 'share' && (
          <ShareInput 
              onInputChange={setEmails} 
              onRemove={handleRemoveUser} 
              file={file} />
        )}
        {value === "delete" && (
            <p className='delete-confirmation'>
              Are you sure want to delete{` `}
              <span className='delete-file-name'>
                {file.name}
              </span>?
            </p>
        )}

        </DialogHeader>
        {['rename','delete','share'].includes(value) && (
          <DialogFooter className='flex flex-col gap-3 md:flex-row'> 
              <Button onClick={closeAllModals} className='modal-cancel-button'>Cancel</Button>

              <Button onClick={handleAction} className='modal-submit-button'>
                <p className='capitalize'>{value}</p>

                {isLoading && (
                  <Image src="/loader.svg" alt='loader' height={24} width={24} className='animate-spin'/>
                )}
              </Button>
          </DialogFooter>
        )}
      </DialogContent>
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModelOpen}>
  <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
  <DropdownMenuTrigger className='shad-no-focus'> 
    <Image src="/dots.svg" alt='dots' width={34} height={34} />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className='max-w-[200px] truncate'>
        {file.name}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    {actionsDropdownItems.map((actionItem)=>(
        <DropdownMenuItem key={actionItem.value} className='shad-dropdown-item' onClick={()=>{
          setAction(actionItem);
          if(
            ['rename',
              'share',
              'delete',
              'details'].includes(actionItem.value)){setIsModelOpen(true)}
        }}>
          {actionItem.value==="download"?
          (
          <Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className='flex items-center gap-2'>

          <Image src={actionItem.icon} alt={actionItem.label} height={30} width={30}/>

          {actionItem.label}

          </Link>):(
            <div className='flex items-center gap-2'>
              <Image src={actionItem.icon} alt={actionItem.label} height={30} width={30}/>
              {actionItem.label}
            </div>
          )}
        </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
{renderDialogContent()}
</Dialog>

  )
}

export default ActionDropdown
