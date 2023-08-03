/**
 * Set a delay for playing the synth audio of a word and its highlighting
 * @param delay time to delay audio (determined by res timing info and playback speed)
 * @param handler apply or remove highlighting
 * @returns id of timeout, clear function, trigger function
 */
export default function newTimeout(delay: number, handler: Function) {
  const id = setTimeout(handler, delay);
  const clear = clearTimeout.bind(null, id);
  function trigger() {
    clear();
    handler();
  }
  return {id, clear, trigger};
};