import stripQuillAttributesFromHTML from "./strip-quill-attributes-from-html";

function no_change(x: any) {
  return { in: x, out: x};
}

const tests = [
  { 
    in: `<span highlight-tag="abcdefg"> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span id="abcdefg"> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span left-edge="abcedf"> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span right-edge="abcedf"> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span highlight-tag=""> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span id=""> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span left-edge=""> hello </span>`,
    out: `<span> hello </span>`,
  },
  { 
    in: `<span right-edge=""> hello </span>`,
    out: `<span> hello </span>`,
  },
  no_change(`highlight-tag=&quot;abced&quot;`),
  {
    in: `<span right-edge="" should-stay=""> hello </span>`,
    out: `<span should-stay=""> hello </span>`,
  },
];

fdescribe("removes html attributes from a string", function(){
  for( const test of tests ) {
    it(`in:  ${test.in}\nout: ${test.out}`, function(){
      expect(stripQuillAttributesFromHTML(test.in)).toEqual(test.out);
    });
  }
});