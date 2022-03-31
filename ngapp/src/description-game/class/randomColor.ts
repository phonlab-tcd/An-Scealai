export class RandomColor {
  _str: string;

  constructor() {
    this._str = getRandomColor();
  }
  str() { 
    return this._str;
  }

}
function getRandomColor() {
  var letters = 'BCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
