export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';
export const themeStorageKey = 'rivelo-theme-preference';
export function normalizeThemePreference(value:unknown):ThemePreference {
  return value==='light'||value==='dark'?value:'system';
}
export function resolveTheme(prefersDark:boolean, preference:ThemePreference='system'):Theme {
  return preference==='system'?(prefersDark?'dark':'light'):preference;
}
// Read the preference before hydration; unavailable storage falls back to the device.
export const themeBootstrap=`(function(){var p='system';try{var v=localStorage.getItem('${themeStorageKey}');if(v==='light'||v==='dark')p=v}catch(e){}var d=p==='dark'||(p==='system'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light'})()`;
