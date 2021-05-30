"use strict";

const axios = require('axios');
const express = require('express');
const router = express.Router();

const API_KEY = "523532";

// Database connection
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "ee599-mysql-db.cqswkw0uvlsi.us-west-1.rds.amazonaws.com",
  user: "admin",
  password: "12345678",
  database: "musics"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to RDS Database!");
});

// Return Artist details from artist name.
// Return type: Object.
router.get('/artist_search', function(req, res) {
    let search_query = req.query.artist_name;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/search.php`,{
        params:{
            "s": search_query
        }
    })
    .then(function (response) {
        let data = response.data.artists || [];
        response = {};
        if(data.length != 0){
			data = data[0];
			response["idArtist"] = data.idArtist || null;
            response["strArtist"] = data.strArtist || null;
			response["intMembers"] = data.intMembers || null;
			response["strGender"] = data.strGender || null;
			response["strStyle"] = data.strStyle || null;
			response["strGenre"] = data.strGenre || null;
			response["strCountry"] = data.strCountry || null;
			response["strBiographyEN"] = data.strBiographyEN || null;
			response["strArtistThumb"] = data.strArtistThumb || null;
            response["strWebsite"] = data.strWebsite || null;
            response["strFacebook"] = data.strFacebook || null;
            response["strTwitter"] = data.strTwitter || null;
            response["intFormedYear"] = data.intFormedYear || null;
        }
        res.json(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

// Return single album details from artist + album name
// Return type: Object.
router.get('/album_search', function(req, res) {
    let search_artist_name = req.query.artist_name;
	let search_album_name = req.query.album_name;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/searchalbum.php`,{
        params:{
            "s": search_artist_name,
			"a": search_album_name
        }
    })
    .then(function (response) {
        let data = response.data.album || [];
        response = {};
		if(data.length != 0){
			data = data[0];
			response["idAlbum"] = data.idAlbum || null;
			response["idArtist"] = data.idArtist || null;
			response["strAlbumStripped"] = data.strAlbumStripped || null;
			response["strArtistStripped"] = data.strArtistStripped || null;
			response["strStyle"] = data.strStyle || null;
			response["strGenre"] = data.strGenre || null;
			response["strDescriptionEN"] = data.strDescriptionEN || null;
			response["intYearReleased"] = data.intYearReleased || null;
			response["strAlbumThumb"] = data.strAlbumThumb || null;
			response["intScore"] = data.intScore || null;
			response["intScoreVotes"] = data.intScoreVotes || null;
		}
        res.json(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

// Return track details from artist + track name
// Return type: Object.
router.get('/track_search', function(req, res) {
    let search_artist_name = req.query.artist_name;
	let search_track_name = req.query.track_name;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/searchtrack.php`,{
        params:{
            "s": search_artist_name,
			"t": search_track_name
        }
    })
    .then(function (response) {
        let data = response.data.track || [];
        response = {};
		if(data.length != 0){
			data = data[0];
			response["idTrack"] = data.idTrack || null;
			response["idAlbum"] = data.idAlbum || null;
			response["idArtist"] = data.idArtist || null;
			response["strTrack"] = data.strTrack || null;
			response["strAlbum"] = data.strAlbum || null;
			response["strArtist"] = data.strArtist || null;
			response["strStyle"] = data.strStyle || null;
			response["strGenre"] = data.strGenre || null;
            response["intDuration"] = data.intDuration || null;
            response["strTrackThumb"] = data.strTrackThumb || null;
            response["strDescriptionEN"] = data.strDescriptionEN || null;
            response["strMusicVid"] = data.strMusicVid || null;
			response["strMusicBrainzID"] = data.strMusicBrainzID || null;
            if(data.idTrack){
                requireScores(data.idTrack,function(err,score_result){
                    if(score_result && score_result.length){
                        response["lyricScore"] = score_result[0].lyric;
                        response["melodyScore"] = score_result[0].melody;
                        response["singerScore"] = score_result[0].singer;
                        response["mvScore"] = score_result[0].mv;
                    }
                    requireReviews(data.idTrack,function(err,review_result){
                        if(review_result && review_result.length){
                            response["reviewContent"] = review_result;
                        }
                        res.json(response);
                    });
                });
            }else{
                res.json(response);
            }
		}
    })
    .catch(function (error) {
        console.log(error);
    });
});

// Return individul Artist details using known TADB_Artist_ID
// Return type: Object.
router.get('/artist_details', function(req, res) {
    let search_query = req.query.id;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/artist.php`,{
        params:{
            "i": search_query
        }
    })
    .then(function (response) {
        let data = response.data.artists || [];
        response = {};
		if(data.length != 0){
			data = data[0];
			response["idArtist"] = data.idArtist || null;
			response["intMembers"] = data.intMembers || null;
			response["strGender"] = data.strGender || null;
			response["strStyle"] = data.strStyle || null;
			response["strGenre"] = data.strGenre || null;
			response["strCountry"] = data.strCountry || null;
			response["strBiographyEN"] = data.strBiographyEN || null;
			response["strArtistThumb"] = data.strArtistThumb || null;
		}
        res.json(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

// Return All Albums for an Artist using known TADB_Artist_ID
// Return type: Array of objects.
router.get('/album_artist', function(req, res) {
    let search_query = req.query.id;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/album.php`,{
        params:{
            "i": search_query
        }
    })
    .then(function (response) {
        let data = response.data.album || [];
        response = [];
        for(let i=0; i<data.length;i++){
			let temp_dict = {};
			temp_dict["idAlbum"] = data[i].idAlbum || null;
			temp_dict["idArtist"] = data[i].idArtist || null;
			temp_dict["strAlbumStripped"] = data[i].strAlbumStripped || null;
			temp_dict["strArtistStripped"] = data[i].strArtistStripped || null;
			temp_dict["strStyle"] = data[i].strStyle || null;
			temp_dict["strGenre"] = data[i].strGenre || null;
			temp_dict["strDescriptionEN"] = data[i].strDescriptionEN || null;
			temp_dict["intYearReleased"] = data[i].intYearReleased || null;
			temp_dict["strAlbumThumb"] = data[i].strAlbumThumb || null;
			temp_dict["intScore"] = data[i].intScore || null;
			temp_dict["intScoreVotes"] = data[i].intScoreVotes || null;
			response.push(temp_dict);
        }
        res.json(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

// Return All Tracks for Album from known TADB_Album_ID
// Return type: Array of objects.
router.get('/track_album', function(req, res) {
    let search_query = req.query.id;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/track.php`,{
        params:{
            "m": search_query
        }
    })
    .then(function (response) {
        let data = response.data.track || [];
        response = [];
        for(let i=0; i<data.length;i++){
			let temp_dict = {};
			temp_dict["idTrack"] = data[i].idTrack || null;
			temp_dict["idAlbum"] = data[i].idAlbum || null;
			temp_dict["idArtist"] = data[i].idArtist || null;
			temp_dict["strTrack"] = data[i].strTrack || null;
			temp_dict["strAlbum"] = data[i].strAlbum || null;
			temp_dict["strArtist"] = data[i].strArtist || null;
			temp_dict["strStyle"] = data[i].strStyle || null;
			temp_dict["strGenre"] = data[i].strGenre || null;
            temp_dict["strTrackThumb"] = data[i].strTrackThumb || null;
            temp_dict["intDuration"] = data[i].intDuration || null;
            temp_dict["strDescriptionEN"] = data[i].strDescriptionEN || null;
            temp_dict["strMusicVid"] = data[i].strMusicVid || null;
			temp_dict["strMusicBrainzID"] = data[i].strMusicBrainzID || null;
			response.push(temp_dict);
        }
        res.json(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

/*---------------Scores and Reviews--------------------*/
function requireScores(track_id,callback){ 
    let scoreData = [];
    con.query(`SELECT track_id,AVG(lyric) as lyric,AVG(melody) as melody,AVG(singer) as singer,AVG(mv) as mv FROM score WHERE track_id=${track_id} GROUP BY track_id`, function (err, result, fields) {
        if (err){
            console.log("Database: Scores Query Failed!");
            callback(err,null);
        }else{
            //console.log(result);
            console.log("Database: Scores Query Succeed!");
            callback(null,result);
        }
    });
};

function requireReviews(track_id,callback){
    let reviewData = [];
    con.query(`SELECT track_id,create_at,content FROM review WHERE track_id=${track_id} ORDER BY review_id DESC LIMIT 10`, function (err, result, fields) {
        if (err){
            console.log("Database: Reviews Query Failed!");
            callback(err,null);
        }else{
            //console.log(result);
            console.log("Database: Scores Query Succeed!");
            callback(null,result);
        }
    });
}
// Return All Scores for an Track using known Track_ID
// Return type: Objects. {status:bool,track_id:int,lyric:int,melody:int,singer:int,mv:int}
router.post('/post_score', function(req, res) {
    let track_id = req.body.track_id;
	let lyric_score = req.body.lyric_score;
    let melody_score = req.body.melody_score;
    let singer_score = req.body.singer_score;
    let mv_score = req.body.mv_score;

    lyric_score = parseInt(lyric_score);
    melody_score = parseInt(melody_score);
    singer_score = parseInt(singer_score);
    mv_score = parseInt(mv_score);

    let response = {"status":false};
    if(lyric_score>0 && lyric_score<=5 && melody_score>0 && melody_score<=5 && singer_score>0 && singer_score<=5 && mv_score>0 && mv_score<=5){
        let sql = "INSERT INTO score (track_id, lyric, melody, singer, mv) VALUES ?";
        let values = [
            [track_id,lyric_score,melody_score,singer_score,mv_score]
        ];
        con.query(sql, [values], function (err, result) {
            if (err){
                console.log("Database: Scores Submission Failed!");
            }
            else{
                console.log("Database: Number of records inserted: " + result.affectedRows);
                requireScores(track_id,function(err,result){
                    if(result && result.length){
                        response["status"] = true;
                        response["track_id"] = result[0].track_id;
                        response["lyricScore"] = result[0].lyric;
                        response["melodyScore"] = result[0].melody;
                        response["singerScore"] = result[0].singer;
                        response["mvScore"] = result[0].mv;
                    }
                    res.json(response);
                });
            }
        });
    }else{
        // Do nothing
    }
});

// Return All Reviews for an Track using known Track_ID
// Return type: Objects. {status:bool,reviewData:[{},,,{}]}
router.post('/post_review', function(req, res) {
    let track_id = req.body.track_id;
	let review = req.body.review;

    let response = {"status":false};
    if(review){
        let sql = "INSERT INTO review (track_id, content) VALUES ?";
        let values = [
            [track_id,review]
        ];
        con.query(sql, [values], function (err, result) {
            if (err){
                console.log("Database: Reviews Submission Failed!");
            }
            else{
                console.log("Database: Number of records inserted: " + result.affectedRows);
                requireReviews(track_id,function(err,result){
                    if(result && result.length){
                        response["status"] = true;
                        response["reviewContent"] = result;
                    }
                    res.json(response);
                });
            }
        });
    }else{
        // Do nothing
    }
});
/*---------------Add-ons--------------------*/

// Return all the Music videos for a known Track id + Artist id
// Return type: Object.
router.get('/trackVideo_track', function(req, res) {
	let search_track_id = req.query.track_id;
    let search_artist_id = req.query.artist_id;
    axios.get(`https://theaudiodb.com/api/v1/json/${API_KEY}/mvid.php`,{
        params:{
            "i": search_artist_id
        }
    })
    .then(function (response) {
        let data = response.data.mvids || [];
        response = {};
		for(let i=0;i<data.length;i++){
			if(data[i].idTrack == search_track_id){
				response[idArtist] = data[i].idArtist || null;
				response[idTrack] = data[i].idTrack || null;
				response[strMusicVid] = data[i].strMusicVid || null;
			}
		}
        res.json(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

// Search Lyrics by MusicBrainz ID
// Return type: Object.
// The API through TheAudioDB doesn't work functionally.

module.exports = router;
