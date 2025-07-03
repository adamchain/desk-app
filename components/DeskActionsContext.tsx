import React, { createContext, useContext } from 'react';

export interface DeskActionsContextType {
    addFile: (name: string, type: string) => void;
    addFolder: (name: string) => void;
    addSticky: () => void;
}

export const DeskActionsContext = createContext<DeskActionsContextType | undefined>(undefined);

export function useDeskActions() {
    const ctx = useContext(DeskActionsContext);
    if (!ctx) throw new Error('useDeskActions must be used within DeskActionsContext.Provider');
    return ctx;
}