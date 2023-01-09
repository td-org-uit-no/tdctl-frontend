import React, { useState, createContext } from 'react';
import { useCheckMobileScreen } from 'hooks/useCheckMobileScreen'; 

export const BrowserContext = createContext({
    isMobile: false
}) 

const BrowserProvider: React.FC = ({ children }) => {

    const isMobile = useCheckMobileScreen()
    // console.log(isMobile)
    return (
        <BrowserContext.Provider value={{ isMobile }}>
            {children}
        </BrowserContext.Provider>
    ) 
} 

export default BrowserProvider

