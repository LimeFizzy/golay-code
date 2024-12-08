import { encode } from './encoding';
import { sendThroughChannel } from './sendingToChannel';
import { decode } from './decoding';

// Load and extract image data using Canvas
export const loadImage = async (file: File): Promise<{ width: number; height: number; pixelData: Uint8ClampedArray }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject('Failed to create canvas context.');
            }
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            resolve({ width: img.width, height: img.height, pixelData: imageData.data });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

// Convert pixel data to binary
export const imageToBinary = (pixelData: Uint8ClampedArray): number[] =>
    Array.from(pixelData).flatMap(byte => byte.toString(2).padStart(8, '0').split('').map(Number));

// Split binary data into blocks with correct padding
export const splitIntoBlocks = (binaryData: number[], blockSize: number = 12): number[][] => {
    const blocks: number[][] = [];
    let currentIndex = 0;
    
    while (currentIndex < binaryData.length) {
        // Create a block from the current slice of binary data
        let block = binaryData.slice(currentIndex, currentIndex + blockSize);
        
        // If the block size is smaller than required, pad with zeros
        if (block.length < blockSize) {
            block = block.concat(new Array(blockSize - block.length).fill(0));
        }

        blocks.push(block);
        currentIndex += blockSize;
    }

    return blocks;
};


// Convert binary data back into pixel data
export const binaryToPixelData = (binaryData: number[]): Uint8ClampedArray => {
    const pixelData = [];
    for (let i = 0; i < binaryData.length; i += 8) {
        const byte = parseInt(binaryData.slice(i, i + 8).join(''), 2);
        pixelData.push(byte);
    }
    return new Uint8ClampedArray(pixelData);
};

// Convert binary data back into a Uint8Array (byte array)
export const binaryToBytes = (binaryData: number[]): Uint8Array => {
    const byteChunks: number[] = [];
    for (let i = 0; i < binaryData.length; i += 8) {
        const byte = parseInt(binaryData.slice(i, i + 8).join(''), 2);
        byteChunks.push(byte);
    }
    return new Uint8Array(byteChunks);
};

export const binaryToImage = async (binaryData: number[], width: number, height: number, canvas: HTMLCanvasElement): Promise<void> => {
    const pixelBuffer = binaryToBytes(binaryData);
    const expectedLength = width * height * 4;  // 4 bytes per pixel (RGBA)

    // Ensure pixelBuffer length matches expected length (width * height * 4)
    let adjustedPixelBuffer: Uint8Array;

    if (pixelBuffer.length < expectedLength) {
        // If it's too small, pad the data with zeros
        adjustedPixelBuffer = new Uint8Array(expectedLength);
        adjustedPixelBuffer.set(pixelBuffer);
    } else if (pixelBuffer.length > expectedLength) {
        // If it's too large, truncate the data
        adjustedPixelBuffer = pixelBuffer.slice(0, expectedLength);
    } else {
        // Otherwise, it's the right length
        adjustedPixelBuffer = pixelBuffer;
    }

    // Now render the image with the adjusted pixel buffer
    return renderToCanvas(adjustedPixelBuffer, width, height, canvas);
};



// Helper function to render the image to the canvas
const renderToCanvas = (pixelBuffer: Uint8Array, width: number, height: number, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    // Ensure the pixelBuffer length is exactly width * height * 4
    const expectedLength = width * height * 4;

    // If the pixelBuffer length is smaller or larger, adjust it
    let adjustedPixelBuffer: Uint8Array;
    
    if (pixelBuffer.length < expectedLength) {
        adjustedPixelBuffer = new Uint8Array(expectedLength);
        adjustedPixelBuffer.set(pixelBuffer);
    } else if (pixelBuffer.length > expectedLength) {
        adjustedPixelBuffer = pixelBuffer.slice(0, expectedLength);
    } else {
        adjustedPixelBuffer = pixelBuffer;
    }

    const imageData = new ImageData(
        new Uint8ClampedArray(adjustedPixelBuffer), // Wrap the pixelBuffer in a Uint8ClampedArray
        width,
        height
    );

    ctx.putImageData(imageData, 0, 0); // Put the ImageData on the canvas
};



export const processImage = async (file: File, errorPossibility: number, canvas: HTMLCanvasElement): Promise<void> => {
    try {
        const { width, height, pixelData } = await loadImage(file);
        const binaryData = imageToBinary(pixelData);

        // Ensure the binary data is not empty
        if (binaryData.length === 0) {
            throw new Error("No pixel data found in the image.");
        }

        const blocks = splitIntoBlocks(binaryData);

        // Encode, transmit, and decode the image blocks
        const encodedBlocks = blocks.map(block => encode(block));
        const transmittedBlocks = encodedBlocks.map(block => sendThroughChannel(block!, errorPossibility));
        const decodedData = transmittedBlocks.flatMap(block => decode(block).slice(0, 12));

        // Reconstruct the image and render it on the canvas
        await binaryToImage(decodedData, width, height, canvas);
    } catch (error) {
        console.error("Error processing image:", error);
        alert("An error occurred while processing the image.");
    }
};

