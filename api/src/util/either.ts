const err = (err:any)=>({err});
const ok = (ok:any)=>({ok});
export = (promise: Promise<any>)=>promise.then(ok,err);
