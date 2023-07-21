import { ZodParsedType } from "zod";

// this function is more useful without a (full) type specification (e.g. do not specify return value)
// because TypeScript is able to infer the types of ok and err properties.
export default function result(p: Promise<any>){
    function on_resolve(ok: any) {
        return {ok} as {ok: Awaited<typeof p>};
    }
    function on_reject(err: any) {
        return {err};
    }
    return p.then(on_resolve,on_reject);
}