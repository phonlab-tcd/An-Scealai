const analyticsId="UA-178889778-1";
const disableStr = `ga-disable-${analyticsId}`;

export const GoogleAnalytics = {
  disable: function (disable = true) {
    window[disableStr] = disable;
  }
}