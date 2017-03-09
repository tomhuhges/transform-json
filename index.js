const fs = require('fs')
const groupArray = require('group-array')
const getTimeBlocks = require('./getTimeBlocks')
const format = require('./format')

const filename = `${__dirname}/${process.argv[2]}`
const newFilename = process.argv[2].replace('.json', '_(copy).json')

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) throw err
  data = JSON.parse(data)
  // group-array doesn't like dots in property names, so replace them
  data.forEach(obj => { obj.Wp_Klant_ID = obj.Wp_Klant_ID.replace('.','%dot') })
  // sort data by client, day and hour
  data = groupArray(data, 'Wp_Klant_ID', 'Wp_Dag', 'Wp_Uur')
  // group consecutive hours into blocks
  data = getTimeBlocks(data)
  // format for MySQL
  data = format(data)

  fs.writeFile(newFilename, JSON.stringify(data), (err) => {
    if (err) throw err
    console.log(`File saved: ${newFilename}`)
  })
})
