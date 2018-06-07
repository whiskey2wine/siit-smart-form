const kid = (start, up, year) => {
  const x = [];
  for (let i = 0; i < year * 2; i++) {
    if (i === 0) {
      x.push(start + start * up);
    }
    x.push(x[i - 1] + x[i - 1] * up);
  }

  return x;
};

console.log(kid(23000, 0.04, 4));
