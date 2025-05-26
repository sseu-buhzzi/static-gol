// math.js

Array.prototype.transpose = function() {
  let new_matrix = this[0].map((_, colIndex) => this.map(row => row[colIndex]));
  this.splice(0, this.length, ...new_matrix);
  return this;
}

Array.prototype.flip = function(direction) {
  switch (direction) {
    case 0:
      return this.map(row => row.reverse());
    case 1:
      return this.reverse();
  }
}