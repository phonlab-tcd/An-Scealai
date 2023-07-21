import obscure_email_address from "./obscure_email_address";
import { expect, describe, it } from "@jest/globals";

const valid_email_addresses = ['email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@[123.123.123.123]',
    '"email"@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com',
    'a@example.com',
];


describe("should obscure valid email addresses",()=>{
    for( const email of valid_email_addresses) {
        it(`${email} should be obscured`, ()=>{
            const obs_result = obscure_email_address(email);
            if("err" in obs_result) {
                console.log(obs_result);
            }
            console.log(obs_result);
            expect("ok" in obs_result).toBeTruthy();
        });
    }
});
