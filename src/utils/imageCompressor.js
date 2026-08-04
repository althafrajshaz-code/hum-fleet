/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Resizes large images to fit within maxWidth/maxHeight.
 * Outputs a Base64 string of the compressed image.
 *
 * @param {File} file - The image file from an <input type="file" />
 * @param {number} maxWidth - Maximum width of the output image
 * @param {number} maxHeight - Maximum height of the output image
 * @returns {Promise<string>} - A promise that resolves to the compressed Base64 PNG string
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type. Expected an image.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        
        // Draw image on canvas, resized
        ctx.drawImage(img, 0, 0, width, height);

        // Export to PNG format (lossless, but smaller resolution)
        const compressedBase64 = canvas.toDataURL('image/png');
        resolve(compressedBase64);
      };
      
      img.onerror = (err) => reject(new Error('Failed to load image for compression: ' + err));
    };
    
    reader.onerror = (err) => reject(new Error('Failed to read file: ' + err));
  });
};
