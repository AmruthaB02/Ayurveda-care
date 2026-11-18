const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export function getToken(){return localStorage.getItem('avc_token') || ''}
export async function api(path, options={}){
  const headers={'Content-Type':'application/json', ...(options.headers||{})};
  if(getToken()) headers.Authorization=`Token ${getToken()}`;
  const response=await fetch(`${BASE}${path}`,{...options,headers});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.detail || Object.values(data).flat().join(' ') || 'Request failed');
  return data;
}
export function saveSession(data){localStorage.setItem('avc_token',data.token);localStorage.setItem('avc_user',JSON.stringify(data.user))}
export function clearSession(){localStorage.removeItem('avc_token');localStorage.removeItem('avc_user')}
export function currentUser(){try{return JSON.parse(localStorage.getItem('avc_user')||'null')}catch{return null}}
