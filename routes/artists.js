const express = require('express')
const router = express.Router()

const Artist = require('../models/Artist')
const Review = require('../models/Review')

// add artist
router.post('/add', async (req, res) => {
    try {
        const artist = await Artist.findOne({name: req.body.name}).exec()
        // aritst does not yet exist in the db
        if(!artist) {
            let newArtist = new Artist(
                {
                    name: req.body.name
                }
            )
            newArtist.save()
            res.redirect('/artists')
        } else {
            res.redirect('/artists')
        }
    } catch (error) {
        console.error(error)
    }
})

// return all aritsts
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find({}).exec()
        res.json({artists})
    } catch (error) {
        console.error(error)
    }
})

// return a single artist
router.get('/:id', async (req, res) => {
    try {
        const artist = await Artist.findOne({_id: req.params.id}).exec()
        const reviews = await Review.find({artist_id: req.params.id}).exec()
        res.render('artist_detail', {artist: artist, reviews: reviews})
    } catch (error) {
        console.error(error)
    }
})

module.exports = router