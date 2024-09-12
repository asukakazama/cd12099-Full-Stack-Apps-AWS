import express from "express";
import isUrl from 'is-url';
import {filterImageFromURL, deleteLocalFiles} from '../util/util.js';
import imageService from "../service/imageService.js";

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
        await imageService.processImage(res, image_url);
        return res.status(200);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    
} );