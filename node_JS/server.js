const { request, json } = require('express');
var express = require('express');

var app = express();

var server = app.listen(3000, function () {
    console.log('start server : localhost:3000');
});
app.get('/', function (req, res) {
    res.send({
        corsTest: '접속 환영'
    });
});
app.set('views', __dirname + '/views');   
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/hi', function (req, res) {
    res.render('ex.html');
});

var cors = require('cors');
// app.use(cors());             // 전체 허용        

// 특정 url 허용
var corsOptions = {
    origin: "http://127.0.0.1:5500"
    , credentials: true
}
app.use(cors(corsOptions));

var iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { children } = require('cheerio/lib/api/traversing');
var Buffer = require('buffer/').Buffer;

app.get('/game', function (req, res) {
    var request = require('request');
    console.log(req.query);
    console.log("url만 뽑기 = " + (req.query.url));
    console.log(typeof(req.query.url));    
    console.log("유저만 뽑기 = " + decodeURI(req.query.user));
    request({url:req.query.url + req.query.user, encoding:null} , function (error, respense, body) {
        if (!error & respense.statusCode == 200) {
            var convertHtml = new Buffer(body);
            var utfHtml = iconv.decode(convertHtml, 'UTF-8').toString();
            var $ = cheerio.load(utfHtml);

            if(req.query.type == 'images/lol'){
                var gameList = [];
                var InfoName = ['GameStats', 'GameSettingInfo', 'KDA', 'Stats'];
                $('.GameItemWrap').each(function(i, k){
                    if(i < 3){
                        var inGame = {};
                        $(this).children().children().children().each(function(index, kk){
                            console.log("====================");
                            if(index < 4){
                                inGame[index] = $(this).attr('class', InfoName[index]).html();
                            }
                        });
                        gameList.push(inGame);
                    }
                });
                try {
                    res.send(gameList);
                } catch (error) {
                    console.log(error);
                }
            }else if(req.query.type == 'images/sudden'){
                var gameList = []; 
                var cnt = 0;
                $('tr:nth-child(1) td').each(function(i, k){
                    var inGame = {};
                    if(i == 0 || i == 2 || i == 3 || i == 4){
                        console.log("====================");
                        inGame[cnt] = $(this).html();
                        cnt++;
                        gameList.push(inGame);
                    }
                });
                res.send(gameList);
            }else if(req.query.type == 'images/star'){
                var gameList = [];
                var cnt = 0;
                $('tbody tr:nth-child(1) td').each(function(i, k){
                    var inGame = {};
                    if(i == 1 || i == 2 || i == 3 || i == 5 || i == 6){
                        console.log('==================');
                        inGame[cnt] = $(this).html();
                        cnt++;
                        gameList.push(inGame);
                    }
                });
                res.send(gameList);
            }else if(req.query.type == 'images/maple'){
                var gameList = [];
                var cnt = 0;
                $('tr.search_com_chk').children().each(function(i, k){
                    var inGame = {};
                    if(i == 1 || i == 2){
                        console.log('==================');
                        inGame[cnt] = $(this).html();
                        cnt++;
                        gameList.push(inGame);
                    }
                });
                try {
                    res.send(gameList);
                } catch (error) {
                    console.log(error);
                }
            }else if(req.query.type == 'images/battle'){
                var gameList = [];
                var cnt = 0;
                $('.matches__list').children().each(function(i, k){
                    if(i < 3){
                        var inGame = {};
                        $(this).children().eq(0).children().each(function(index, kk){
                            if(index < 5){
                                inGame[index] = $(this).html();
                            }else if(index == 5){
                                inGame[index] = $(this).children().eq(1).html();
                            }
                        });
                        gameList.push(inGame);
                    }
                });
                gameList.push("맞추기");
                gameList.push("맞추기");
                gameList.push("맞추기");
                
                try {
                    res.send(gameList);
                } catch (error) {
                    console.log(error);
                }
            }
            console.log(gameList);
        } else {
            console.log(error);
        }
    });
});