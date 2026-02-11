

import { QueryProvider as TanStackQueryProvider   } from "@/providers/TanStackQueryProvider"


export interface ProviderPropsTypes {
    children: React.ReactNode ;
}


export const Providers = ({children }:ProviderPropsTypes) => {

    return(
 
    <TanStackQueryProvider>
          {children}
    </TanStackQueryProvider>
   
    )
}
