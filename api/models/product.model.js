import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title :{
            type: String,
            required: true,
            unique: true
        },
        description :{
            type: String,
            required: true
        },
        price :{
            type: Number,
            required: true
        },
        category :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        brand :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },
        countInStock :{
            type: Number,
            required: true
        },
        imageUrl :{
            type: String,
            required: true
        },
        rating :{
            type: Number,
            required: true
        },
    },
    { timestamps: true }
    
);