const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlbumSchema = new Schema(
    {
        title: {type: String, required: true},
        artist: {type: String, required: true},
        artist_id: {type: String, required: true},
        date_added: {type: Date, required: true},
        date_modified: {type: Date, required: true}
    }
)
AlbumSchema.virtual('url').get(function() {
    return `/albums/${this._id}`
})
module.exports = mongoose.model('Album', AlbumSchema)