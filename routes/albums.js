const express = require('express')
const router = express.Router()

const Album = require('../models/Album')
const Artist = require('../models/Artist')

// add an album
router.post('/add', async (req, res) => {
    try {
        const foundAlbum = await Album.findOne({title: req.body.title}).exec()
        if(foundAlbum) {
            // album already exists, redirect
            res.redirect('/albums')
        } else {
            // album does not yet exist in db
            let albumData = {
                title: req.body.title,
                artist: req.body.artist,
                artist_id: 0
            }
            const foundArtist = await Artist.findOne({name: req.body.artist}).exec()
            if(!foundArtist) {
                // dynamically add artist to db if not yet exists
                let newArtist = new Artist(
                    {
                        name: req.body.artist
                    }
                )
                newArtist.save().then(result => albumData.artist_id = result._id)
            } else {
                albumData.artist_id = foundArtist._id
            }
            let newAlbum = new Album(albumData)
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
        const albums = await Album.find({}).exec()
        res.json({albums})
    } catch (error) {
        console.error(error)
    }
})

// return one album
router.get('/:id', async (req, res) => {
    try {
        const album = Album.findOne({_id: req.params.id}).exec()
        res.json({album})
    } catch (error) {
        console.error(error)
    }
})

module.exports = router