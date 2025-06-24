import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    movie: {type: String, requried: true, ref: 'movie'},
    showDateTime : {type: Date, required: true},
    showPrice : {type: Number, required: true},
    occupiedSeats : {type: Object, default: {}},
}, {minimize: false});

const Show = mongoose.models.show || mongoose.model('show', showSchema);

export default Show;