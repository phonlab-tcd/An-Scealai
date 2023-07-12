import { describe, it, expect } from "@jest/globals";
import User from "../../models/user";

describe("mongoose behaviour validation",function(){
    it("should return null when document does not exist", async function(){
        const result = await User.findOne({username: "username that definitely does not exist"}).then(ok=>({ok}),err=>({err}));
        expect("ok" in result).toBeTruthy();
        expect(result.ok).toBeNull();
    })
})