import React, { createContext, useContext } from 'react';

export interface DeskActionsContextType {
    addFile: (name: string, type: string) => void;
    addFolder: (name: string) => void;
    addSticky: () => void;
    setAddFile?: (fn: (name: string, type: string) => void) => void;
    setAddFolder?: (fn: (name: string) => void) => void;
    setAddSticky?: (fn: () => void) => void;
}

export const DeskActionsContext = createContext<DeskActionsContextType | undefined>(undefined);

export function useDeskActions() {
    const ctx = useContext(DeskActionsContext);
    if (!ctx) throw new Error('useDeskActions must be used within DeskActionsContext.Provider');
    return ctx;
}
