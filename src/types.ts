
export type Product = { id:string; name:string; createdAt:string };
export type DocItem = { id:string; name:string; size:number; type:string };
export type PageExtract = { page:number; text:string; source:'native'|'ocr'; confidence?:number };
export type HybridOutput = { ok:boolean; pages:PageExtract[]; thumbnails:string[]; fullImages:string[]; isHybrid:boolean };
