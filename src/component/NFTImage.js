import React, { useState, useEffect } from 'react';

const NFTImage = ({ imageUrl }) => {
    const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    async function fetchImage() {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const src = URL.createObjectURL(blob);
      setImgSrc(src);
    }

    fetchImage();
  }, [imageUrl]);

  return (
    <label>
      <img className='singleImage' src={imgSrc} alt="" />
    </label>
  );
}

export default NFTImage;