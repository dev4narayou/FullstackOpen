const reverse = (string) => {
  return string.split("").reverse().join("");
};

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

const totalLikes = (blogs) => {
  const reducer = (acc, item) => {
    return acc + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
}

module.exports = {
  reverse,
  average,
  totalLikes,
};
