let cheerio = require('cheerio')
let Promise = require('bluebird')
let request = require('request');
let rp = require('request-promise');
let _ = require('lodash');
const fs = require('fs')



// let targetlink = "https://ck101.com/forum.php?mod=viewthread&tid=4592622&extra=page%3D1&page="

// let targetlink = "https://ck101.com/forum.php?mod=viewthread&tid=1889094&extra=&page=1&page="
// let targetlink = "https://ck101.com/forum.php?mod=viewthread&tid=2166840&extra=&page=1&page="

let websiteCrawler = function () {
    let mainText = ''
    let targetlink = ''
    this.init = async (input) => {
        console.log(input)
        this.targetlink = input.site
        await this.loop()
        // print data
        fs.writeFile("./" + input.name + '.txt', mainText, function (err) {
            if (err) {
                return console.log(err)
            }
            console.log("Txt saved")
        })
    }


    this.loop = async () => {
        let endpage = 1
        // console.log(baselink[baselink.length - 1], baselink.length)
        let options = {
            uri: this.targetlink,
            transform: function (body) {
                return cheerio.load(body, {decodeEntities: true});
            }
        }
        try {
            let $ = await rp(options)
            $('.pg').map((index, el) => {
                // console.log(el )
                if (index === 1) {
                    el.children.forEach((item, i) => {
                        if (item.name === 'a') {
                            if (_.split(item.children[0].data, " ").length === 2) {
                                endpage = _.split(item.children[0].data, " ")[1]
                            }

                        }
                    })
                }
            })
            for (let i = 1; i <= endpage; i++) {
                let completelink = this.targetlink + i

                console.log(completelink)
                await this.loadwebsite(completelink)
                setTimeout( () => {} , 500)
            }

        } catch (e) {
            console.log(e)
        }


    }

    this.loadwebsite = async (newlink) => {
        let options = {
            uri: newlink,
            transform: function (body) {
                return cheerio.load(body, {decodeEntities: true});
            }
        }

        try {
            let $ = await rp(options)
            // console.log($.html({ decodeEntities: false }))
            // this is for one website
            $('.t_f').map((index, item) => {
                // console.log(item)
                item.children.map((nextitem, nextindex) => {
                    if (nextitem.type === 'text') {
                        // console.log(nextitem.data)
                        // _.trim(nextitem.data, '\n')
                        mainText = mainText + nextitem.data
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }

    }

}


module.exports = new websiteCrawler();