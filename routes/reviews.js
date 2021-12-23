const express = require('express')
const router = express.Router()

const Review = require('../models/Review')
const Artist = require('../models/Artist')
const Album = require('../models/Album')

// TODO ////////////////////////////
// MAKE THE FUNCTIONALITY OF DYNAMICALLY CREATING ARTISTS AND
// ALBUMS MATCH THE METHODS WITHIN albums.js
// e.g. RECAST THE foundObject AS A NEW MODEL AND EXTRACT
// ITS ID DIRECTLY IN THE newReview CONSTRUCTOR


// add a review
router.post('/add', async (req, res) => {
    try {
        // review for this album does not yet exist in the db
        let reviewData = {
            album: req.body.title,
            artist: req.body.artist,
            description: req.body.description,
            artist_id: 0,
            album_id: 0
        }
        // check for existing artist
        const foundArtist = await Artist.findOne({name: req.body.artist}).exec()
        if(!foundArtist) {
            // dynamically add new artist to db
            let newArtist = new Artist(
                {
                    name: req.body.artist
                }
            )
            newArtist.save().then(result => reviewData.artist_id = result._id)
        } else {
            reviewData.artist_id = foundArtist._id
        }
        //check for existing album
        const foundAlbum = await Album.findOne({title: req.body.title}).exec()
        if(!foundAlbum) {
            let newAlbum = new Album(
                {
                    title: req.body.title,
                    artist: req.body.artist,
                    artist_id: reviewData.artist_id
                }
            )
            newAlbum.save().then(result => reviewData.album_id = result._id)
        } else {
            reviewData.album_id = foundAlbum._id
        }
        // finally we create our new review
        let newReview = new Review(reviewData)
        newReview.save()
        res.redirect('/reviews')
        
    } catch (error) {
        console.error(error)
    }
})

// return all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({}).exec()
        res.json({reviews})
    } catch (error) {
        console.error(error)
    }
})

module.exports = router