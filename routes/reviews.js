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
        // check for existing artist
        var foundArtist = await Artist.findOne({name: req.body.artist}).exec()
        if(!foundArtist) {
            // dynamically add new artist to db
            foundArtist = new Artist(
                {
                    name: req.body.artist
                }
            )
            foundArtist.save()
        } 
        //check for existing album
        var foundAlbum = await Album.findOne({title: req.body.title}).exec()
        if(!foundAlbum) {
            foundAlbum = new Album(
                {
                    title: req.body.title,
                    artist: req.body.artist,
                    artist_id: foundArtist._id
                }
            )
            foundAlbum.save()
        }
        // finally we create our new review
        let newReview = new Review(
            {
                album: req.body.title,
                artist: req.body.artist,
                description: req.body.description,
                album_id: foundAlbum._id,
                artist_id: foundArtist._id
            }
        )
        newReview.save()
        res.redirect('/')
    } catch (error) {
        console.error(error)
    }
})

// return all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({}).exec()
        res.render('reviews', {reviews})
    } catch (error) {
        console.error(error)
    }
})

module.exports = router