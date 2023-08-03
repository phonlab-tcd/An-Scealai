import Quill from "quill";

const QuillTooltip = Quill.import("ui/tooltip");

function emptyQuillStuff() {
  return { scrollLeft: 0, scrollTop: 0, }
}

QuillTooltip.prototype.positionBottomRight = function(this: typeof QuillTooltip, location) {
  const bounds = this.quill.getBounds(location, 0);
  const quillStuff = document.querySelector(".ql-editor");
  const padding_top = quillStuff ? Number.parseInt(window.getComputedStyle(quillStuff).getPropertyValue('padding-top').split("px")[0]) : 0;
  const left = bounds.right + (quillStuff || emptyQuillStuff()).scrollLeft;
  const top = bounds.bottom + (quillStuff || emptyQuillStuff()).scrollTop - padding_top;

  this.root.style.left = left + "px";
  this.root.style.top = top + "px";
}

QuillTooltip.prototype.positionTopLeft = function(this: typeof QuillTooltip, location) {
  const bounds = this.quill.getBounds(location, 0);
  const quillStuff = document.querySelector(".ql-editor");
  const padding_top = quillStuff ? Number.parseInt(window.getComputedStyle(quillStuff).getPropertyValue('padding-top').split("px")[0]) : 0;
  const left = bounds.left + (quillStuff || emptyQuillStuff()).scrollLeft;
  const top = bounds.top + (quillStuff || emptyQuillStuff()).scrollTop - padding_top;

  const { width, height } = this.root.getBoundingClientRect();
  this.root.style.left = `${left - width }px`;
  this.root.style.top = `${top - height}px`;
  console.log(this.style);
}