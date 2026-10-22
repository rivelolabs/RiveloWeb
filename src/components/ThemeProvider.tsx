"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {normalizeThemePreference,resolveTheme,themeStorageKey,type ThemePreference} from '@/lib/theme';
type ThemeContextValue={preference:ThemePreference;setPreference:(value:ThemePreference)=>void};
const ThemeContext=createContext<ThemeContextValue|null>(null);
export function ThemeProvider({children}:{children:React.ReactNode}) {
  const [preference,setValue]=useState<ThemePreference>('light');
  const current=useRef<ThemePreference>('light');
  const setPreference=useCallback((value:ThemePreference)=>{
    current.current=value;setValue(value);
    document.documentElement.dataset.theme=resolveTheme(matchMedia('(prefers-color-scheme: dark)').matches,value);
    try{localStorage.setItem(themeStorageKey,value);}catch{}
  },[]);
  useEffect(()=>{
    const media=matchMedia('(prefers-color-scheme: dark)');
    try{current.current=normalizeThemePreference(localStorage.getItem(themeStorageKey));}catch{}
    setValue(current.current);
    const sync=()=>{document.documentElement.dataset.theme=resolveTheme(media.matches,current.current);};
    const storage=(event:StorageEvent)=>{if(event.key===themeStorageKey||event.key===null){current.current=normalizeThemePreference(event.newValue);setValue(current.current);sync();}};
    sync();media.addEventListener('change',sync);window.addEventListener('storage',storage);
    return()=>{media.removeEventListener('change',sync);window.removeEventListener('storage',storage);};
  },[]);
  return <ThemeContext.Provider value={{preference,setPreference}}>{children}</ThemeContext.Provider>;
}
export function useTheme(){const context=useContext(ThemeContext);if(!context)throw Error('Theme controls require ThemeProvider.');return context;}
