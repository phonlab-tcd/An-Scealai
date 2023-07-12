import server from "../server";
import { describe, it } from "@jest/globals";
import supertest from "supertest";

// TODO: should be able to run tests without config
import dotenv from "dotenv";
dotenv.config();

const request = supertest(server);

describe("scealai backend express app object", function(){
    it("does not need Bearer token for /user/verify endpoint", async function() {
        console.log(process.env);
        const res = await request.get("/user/verify");
        console.log(res);
    });
});