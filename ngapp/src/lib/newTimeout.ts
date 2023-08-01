export default function newTimeout(delay: number, handler: Function) {
  const id = setTimeout(handler, delay);
  const clear = clearTimeout.bind(null, id);
  function trigger() {
    clear();
    handler();
  }
  return {id, clear, trigger};
};