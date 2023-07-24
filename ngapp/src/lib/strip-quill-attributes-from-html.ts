
const EMPTY_STRING = "";

const ATTRIBUTES_TO_REMOVE = [
  "id",
  "highlight-tag",
  "left-edge",
  "right-edge",
];

// ? means evaluate lazily  (take minimum number of matches);
const ATTRIBUTE_VALUE_REGEX = /=".*?"/;

const attribute_regexes = ATTRIBUTES_TO_REMOVE.map(specific_attribute_regex);

const combined_attribute_regex = combine_regexes(attribute_regexes);

export function specific_attribute_regex(attribute_name: string) {
  return new RegExp(/\s*/.source + new RegExp(attribute_name).source +  ATTRIBUTE_VALUE_REGEX.source);
}

export function combine_regexes(regexes: RegExp[], flags="g"): RegExp {
  function get_source(r: RegExp) {
    return r.source;
  }
  return new RegExp(regexes.map(get_source).join("|"), flags);
}

function isFunction(x: any): boolean {
  if(x instanceof Function) return true;
  if(typeof x === "function") return true;
  return false;
}

export default function stripQuillAttributesFromHTML(html: string) {
  // TODO could just use zod instead of manual function validation? (neimhin 24/7/23)
  if(!isFunction(html.replace)) return "";
  return html.replace(combined_attribute_regex, EMPTY_STRING);
}