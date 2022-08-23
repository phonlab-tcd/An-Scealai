const analyticsId="UA-178889778-1";
const disableStr = `ga-disable-${analyticsId}`;

export function disable(disable = true) {
  window[disableStr] = disable;
}

export function isDisabled() {
  return window[disableStr];
}
