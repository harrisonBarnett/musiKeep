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
                    name: req.body.artist,
                    date_added: Date.now(),
                    date_modified: Date.now()
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
                    artist_id: foundArtist._id,
                    date_added: Date.now(),
                    date_modified: Date.now()
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
                artist_id: foundArtist._id,
                date_added: Date.now(),
                date_modified: Date.now()
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
        const reviews = await Review.find({}).sort('-date_modified').exec()
        res.render('reviews', {reviews})
    } catch (error) {
        console.error(error)
    }
})
// return a single review 
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findOne({_id: req.params.id}).exec()
        res.render('review_detail', {review: review})
    } catch (error) {
        console.error(error)
    }
})
// delete a review
router.delete('/:id', async (req, res) => {
    try {
        Review.deleteOne({_id: req.params.id}).remove().exec()
        res.redirect('/')
    } catch (error) {
        console.error(error)
    }
})

// update a review
router.put('/:id', async (req, res) => {
    try {
    await Review.updateOne({_id: req.params.id}, {
        description: req.body.description,
        date_modified: Date.now()
    })
    res.redirect('/')
    } catch (error) {
        console.error(error)
    }
})
module.exports = router