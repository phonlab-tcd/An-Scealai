
type ResultFunc = <T>(input: Promise<T>) => Promise<{ok: T} | {err: any}>;


const result: ResultFunc = function(p){
    function isOk(ok: any) {
        return {ok};
    }
    function isErr(err: any) {
        return {err};
    }
    return p.then(isOk,isErr);
}
export default result;