import express from "express";
import isUrl from 'is-url';
import {filterImageFromURL, deleteLocalFiles} from '../util/util.js';

export const router = express.Router();

router.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;

    // 1. validate the image_url query
    // 1.1. validate required
    if ( !image_url ) {
        return res.status(400).send(`Image url is required`);
    }
    // 1.2. validate valid
    if ( !isUrl(image_url) ) {
        return res.status(400).send(`Image url is not valid`);
    }

    try {
        // 2. call filterImageFromURL(image_url) to filter the image
        const imageFilteredPath = await filterImageFromURL(image_url);
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

        return res.status(200);
        
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    
} );