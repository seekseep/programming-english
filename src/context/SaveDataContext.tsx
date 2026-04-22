import { createContext, useContext } from 'react'
import { useSaveData } from '#/hooks/useSaveData'

type SaveDataContextType = ReturnType<typeof useSaveData>

const SaveDataContext = createContext<SaveDataContextType | null>(null)

export function SaveDataProvider({ children }: { children: React.ReactNode }) {
  const saveData = useSaveData()
  return (
    <SaveDataContext.Provider value={saveData}>
      {children}
    </SaveDataContext.Provider>
  )
}

export function useSave() {
  const ctx = useContext(SaveDataContext)
  if (!ctx) throw new Error('useSave must be used within SaveDataProvider')
  return ctx
}
