const analyticsId="UA-178889778-1";
const disableStr = `ga-disable-${analyticsId}`;

export const GoogleAnalytics = Object.freeze({
  disable: function (disable = true) {
    window[disableStr] = disable;
  },
  isEnabled: function () {
    return !window[disableStr];
  },
});

GoogleAnalytics.disable();