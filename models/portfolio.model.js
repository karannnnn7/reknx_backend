import mongoose from "mongoose"

const portfolioDataSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    img : {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const Portfolio = mongoose.model('Portfolio',portfolioDataSchema)