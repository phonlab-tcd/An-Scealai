module.exports = ()=>{
  if(process.env.NODE_ENV !== 'test'){
    const id=()=>{};
    id.skip = ()=>{};
    describe=id;
    it=id;
  }
  return {describe,it};
};
