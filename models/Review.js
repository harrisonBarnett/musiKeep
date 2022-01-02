const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema(
    {
        album: {type: String, required: true},
        artist: {type: String, required: true},
        description: {type: String, required: true},
        album_id: {type: String, required: true},
        artist_id: {type: String, required: true},
        date_added: {type: Date, required: true},
        date_modified: {type: Date, required: true}
    }
)
ReviewSchema.virtual('url').get(function() {
    return `/reviews/${this._id}`
})
module.exports = mongoose.model('Review', ReviewSchema)