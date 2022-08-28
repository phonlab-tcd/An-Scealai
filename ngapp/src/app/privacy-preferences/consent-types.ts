const acceptReject = [{value: "reject", display: "Reject"},{value: "accept", display: "Accept"}];

export const consentTypes = Object.freeze({
    'Google Analytics': {
        short: "Send anonymous usage data to An Scéalaí's Google Analytics account.",
        full: `
            By enabling this feature you agree to have anonymous data about how you interact with the An Scéalaí platform processed by Google Analytics.
            Google Analytics will be allowed to process information about which pages of the website you visit,
            how long you spend on each page, your approximate geographic location, and the devices you use to access the site.
            This data will be anonymised and it will not be possible for Google Analytics or An Scéalaí link this data to your account.
            Please consider enabling this feature to help the An Scéalaí development team can continue to improve you experience with the site.
        `,
        allowUnder16: false,
        options: acceptReject,
    },
    'Engagement': {
        short: "Allow An Scéalaí to store additional data about how you use the website.",
        full: `
            An Scéalaí can record fine-grained information about the features of the website you use.
            This data is not anonymised, and An Scéalaí <b>can</b> link the recorded data to your account.
            This data will not be processed by any third parties, unless you release the data explicitly in the future.
            If you do nothing, the data will never be shared with a third party.
            Please consider enabling this feature to help the An Scéalaí development team improve the tools offered on the website.
        `,
        allowUnder16: false,
        options: acceptReject,
    },
    'Cloud Storage': {
        short: "Store your documents and messages securely on An Scéalaís database in the cloud.",
        full: `
            The An Scéalaí website uses a backend server to enable most of its functionality.
            In order for An Scéalaí to function normally
            it is required that you consent to having your data
            processed on our private cloud infrastructure.
            Unfortunately, at this time, you will not be able to use An Scéalaí
            if you decide not to allow An Scéalaí to process your data in this way.
        `,
        allowUnder16: true,
        options: acceptReject,
    },
} as const);

export type ConsentGroup = keyof typeof consentTypes;