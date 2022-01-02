const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistSchema = new Schema(
    {
        name: {type: String, required: true},
        date_added: {type: Date, required: true},
        date_modified: {type: Date, required: true}
    }
)
ArtistSchema.virtual('url').get(function() {
    return `/artists/${this._id}`
})
module.exports = mongoose.model('Artist', ArtistSchema)