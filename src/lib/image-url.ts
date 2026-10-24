/** Turns a pasted picture link into one a browser can show. Google Drive share pages become their thumbnail;
 *  links that are pages rather than pictures (share.google, Google Photos albums, Docs) are dropped. */
export function displayImage(value:string|null|undefined):string|null{
  if(!value)return null;
  try{
    const url=new URL(value);
    if(!['http:','https:'].includes(url.protocol))return null;
    if(['share.google','photos.app.goo.gl','docs.google.com','photos.google.com'].includes(url.hostname))return null;
    if(url.hostname==='drive.google.com'){
      const id=url.pathname.match(/\/file\/d\/([\w-]{10,})/)?.[1]||url.searchParams.get('id');
      return id&&/^[\w-]{10,}$/.test(id)?`https://drive.google.com/thumbnail?id=${id}&sz=w256`:null;
    }
    return url.toString();
  }catch{return null;}
}
