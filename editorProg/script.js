function previewWatermarkImage() {
    const watermarkImage = document.getElementById('watermarkImage');
    const watermarkPreview = document.getElementById('watermarkPreview');

    const file = watermarkImage.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            watermarkPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        watermarkPreview.src = '';
    }
}

function processImage() {
    const inputImage = document.getElementById('inputImage');
    const watermarkImage = document.getElementById('watermarkImage');
    const watermarkWidth = parseInt(document.getElementById('watermarkWidth').value);
    const watermarkHeight = parseInt(document.getElementById('watermarkHeight').value);
    const position = document.getElementById('position').value;
    const outputImage = document.getElementById('output');
    
    const imageFile = inputImage.files[0];
    const watermarkFile = watermarkImage.files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Determine as dimensões do canvas para redimensionar a imagem
                const maxWidth = 750;
                const maxHeight = 750;
                const imageAspectRatio = img.width / img.height;
                const canvasAspectRatio = maxWidth / maxHeight;
                let width = img.width;
                let height = img.height;

                if (imageAspectRatio > canvasAspectRatio) {
                    width = maxWidth;
                    height = width / imageAspectRatio;
                } else {
                    height = maxHeight;
                    width = height * imageAspectRatio;
                }

                canvas.width = maxWidth;
                canvas.height = maxHeight;
                
                // Preencha o canvas com fundo branco
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, maxWidth, maxHeight);
                
                // Centralize a imagem no canvas
                const x = (maxWidth - width) / 2;
                const y = (maxHeight - height) / 2;
                
                ctx.drawImage(img, x, y, width, height);

                // Adicione a marca d'água se uma imagem for selecionada
                if (watermarkFile) {
                    const watermark = new Image();
                    watermark.src = URL.createObjectURL(watermarkFile);
                    watermark.onload = function() {
                        let watermarkX, watermarkY;
                        
                        // Determine a posição da marca d'água com base na seleção do usuário
                        switch (position) {
                            case "top-left":
                                watermarkX = 10;
                                watermarkY = 10;
                                break;
                            case "top-center":
                                watermarkX = (maxWidth - watermarkWidth) / 2;
                                watermarkY = 10;
                                break;
                            case "top-right":
                                watermarkX = maxWidth - watermarkWidth - 10;
                                watermarkY = 10;
                                break;
                            case "bottom-left":
                                watermarkX = 10;
                                watermarkY = maxHeight - watermarkHeight - 10;
                                break;
                            case "bottom-center":
                                watermarkX = (maxWidth - watermarkWidth) / 2;
                                watermarkY = maxHeight - watermarkHeight - 70;
                                break;
                            case "bottom-right":
                                watermarkX = maxWidth - watermarkWidth - 10;
                                watermarkY = maxHeight - watermarkHeight - 10;
                                break;
                            default:
                                watermarkX = 10;
                                watermarkY = maxHeight - watermarkHeight - 10;
                        }

                        ctx.drawImage(watermark, watermarkX, watermarkY, watermarkWidth, watermarkHeight);
                        
                        outputImage.src = canvas.toDataURL('image/jpeg');
                        outputImage.style.display = 'block';
                    };
                } else {
                    outputImage.src = canvas.toDataURL('image/jpeg');
                    outputImage.style.display = 'block';
                }
            };
        };
        reader.readAsDataURL(imageFile);
    }
}