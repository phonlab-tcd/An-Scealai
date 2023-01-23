export function getBaseUrl(): string {
  return document.baseURI.replace(new RegExp("/?{scealai/}?$"),"/anscealaibackend/")
}
