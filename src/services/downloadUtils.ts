import JSZip from "jszip";

async function createBlob(image: ImageBitmap) {
    const imageBitmap = await createImageBitmap(image); // Your ImageBitmap

    const ocanvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = ocanvas.getContext('bitmaprenderer');
    (ctx as ImageBitmapRenderingContext).transferFromImageBitmap(imageBitmap);
    return await (ocanvas as any).convertToBlob({type: 'image/png'});
}

export const createZipUri = async (images: ImageBitmap[]) => {
    // Create a new JSZip instance
    const zip = new JSZip();

    await Promise.all(images.map(async (img, i) => {
        let blob = await createBlob(img);
        return zip.file(`plot${i}.png`, blob);
    }))

    // Generate the ZIP file as a blob
    const zipBlob = await zip.generateAsync({type: "blob"});

    return URL.createObjectURL(zipBlob);
}

export const downloadData = (data: any, type: string, name: string) => {
    let blob = new Blob([data], {type});
    const uri = window.URL.createObjectURL(blob);
    downloadUri(uri, name)
}

export const downloadImage = async (image: ImageBitmap, name: string) => {
    let blob = await createBlob(image)
    const uri = window.URL.createObjectURL(blob);
    downloadUri(uri, name)
}

export const downloadUri = (uri: string, name: string) => {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();

    window.URL.revokeObjectURL(uri);
}
