import mongoose from 'mongoose';

let urlSchema = new mongoose.Schema({
    originalURL:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    }
},{timestamps: true});

export const URL = mongoose.model("URL", urlSchema);