const isBase64Image = (img) => {
  return typeof img === 'string' && img.startsWith('data:image');
};
module.exports =  {isBase64Image} ;