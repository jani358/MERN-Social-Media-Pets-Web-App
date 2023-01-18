import { createContext, useEffect, useState } from "react";

export const SideBarOpenCloseContext = createContext();

export const  SideBarOpenCloseContextProvider = ({children})=>{


   const [sideBarMode,setSideBarMode]=useState(false)

   const toggle = () =>{
    setSideBarMode(!sideBarMode)
   }

   return(
    <SideBarOpenCloseContext.Provider value={{toggle,sideBarMode}}>
        {children}
    </SideBarOpenCloseContext.Provider>
   )
}