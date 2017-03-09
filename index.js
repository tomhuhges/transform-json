const fs = require('fs')
const groupArray = require('group-array')
const getTimeBlocks = require('./getTimeBlocks')
const format = require('./format')

if (!~process.argv[2].indexOf('.json')) {
  throw new Error("argument must be a json file")
}

const filename = `${__dirname}/${process.argv[2]}`
const newFilename = process.argv[2].replace('.json', '_(copy).json')

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) throw err
  data = JSON.parse(data)
  // remove '.' from client/freelancer name
  data.forEach(obj => {
    obj.Wp_Klant_ID = obj.Wp_Klant_ID.replace('.','')
    obj.Wp_Mdw_ID = obj.Wp_Mdw_ID.replace('.','')
  })
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
