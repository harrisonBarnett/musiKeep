const express = require('express')
const router = express.Router()

const Album = require('../models/Album')
const Artist = require('../models/Artist')
const Review = require('../models/Review')

// add an album
router.post('/add', async (req, res) => {
    try {
        const foundAlbum = await Album.findOne({title: req.body.title}).exec()
        if(foundAlbum) {
            // album already exists, redirect
            res.redirect('/albums')
        } else {
            // album does not yet exist in db
            var foundArtist = await Artist.findOne({name: req.body.artist}).exec()
            if(!foundArtist) {
                // dynamically add artist to db if not yet exists
                 foundArtist = new Artist(
                    {
                        name: req.body.artist,
                        date_added: Date.now(),
                        date_modified: Date.now()
                    }
                )
                foundArtist.save()
            }
            let newAlbum = new Album(
                {
                    title: req.body.title,
                    artist: req.body.artist,
                    artist_id: foundArtist._id,
                    date_added: Date.now(),
                    date_modified: Date.now()
                }
            )
            newAlbum.save()
            res.redirect('/albums')
        }
    } catch (error) {
        console.error(error)
    }
})

// return all albums
router.get('/', async (req, res) => {
    try {
        const albums = await Album.find({}).sort('-date_modified').exec()
        res.render('albums', {albums: albums})
    } catch (error) {
        console.error(error)
    }
})

// return one album
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findOne({_id: req.params.id}).exec()
        const reviews = await Review.find({album: album.title}).sort('-date_modified').exec()
        res.render('album_detail', {album: album, reviews: reviews})

    } catch (error) {
        console.error(error)
    }
})

// delete an album and all associated reviews
router.delete('/:id', async (req, res) => {
    res.send('delete request')
})

// update a review
router.put('/:id', async (req, res) => {
    res.send('put request')
})

module.exports = router