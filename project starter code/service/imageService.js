import {filterImageFromURL, deleteLocalFiles} from '../util/util.js';

export class ImageService {
    async processImage(res, imageUrl) {
        // 2. call filterImageFromURL(image_url) to filter the image
        const imageFilteredPath = await filterImageFromURL(imageUrl);
        console.log('imageFilteredPath=============:' + imageFilteredPath);

        await new Promise((resolve, reject) => {
            // 3. send the resulting file in the response
            res.sendFile(imageFilteredPath, async (err) => {
                if (err) {
                    reject(new Error("Error sending file."));
                }
    
                // 4. Deletes any files on the server on finish of the response
                try {
                    const localImagePath = process.env.ROOT_DIR + imageFilteredPath;
                    await deleteLocalFiles([localImagePath]);
                    resolve();
                } catch (err) {
                    reject(new Error("Error deleting local files."));
                }
            });
        });
    }
}

export default new ImageService()