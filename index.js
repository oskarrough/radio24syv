const fs = require('fs')
const got = require('got')

// ID of the show. In this case, Croque Monsieur
const show = 11929746
// Which years to include
const years = [2015, 2016, 2017, 2018, 2019]

;(async () => {
  // Fetch them and write them to a text file.
  const promises = years.map(year => fetchAudioUrls(show, year))
  const urls = await Promise.all(promises)
  writeUrlsToFile(urls.flat())
})()

// Returns an array of URLs to the audio file behind the podcast.
async function fetchAudioUrls(programId, year) {
  const url = `https://api.radio24syv.dk/v2/podcasts/program/${programId}?year=${year}&order=desc`
  const filePrefix = 'https://arkiv.radio24syv.dk/attachment'
  try {
    const {body} = await got(url, {json: true})
    return body.map(program => filePrefix + program.audioInfo.url)
  } catch (error) {
    console.log(error)
  }
}

function writeUrlsToFile(urls, fileName = 'urls.txt') {
  const fileContents = urls.join('\n')
  fs.writeFile(fileName, fileContents, err => {
    if (err) throw err
    console.log(`Success! To download all of them, run:
  wget -i ${fileName} -c -P ./some-folder/`)
  })
}
