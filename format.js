const moment = require('moment')
require('moment-duration-format')

const format = (data) => {

  const newJSON = []

  for (const client in data) {
    for (const day in data[client]) {
      const timeblocks = data[client][day]

      timeblocks.forEach(block => {
        const created = Date.now()
        const clientId = block[0].Wp_Klant_ID
        const dow = block[0].Wp_Dag === 7 ? 0 : block[0].Wp_Dag
        const startTime = (block[0].Wp_Uur[0] - 1) * 30 / 60
        const endTime = block[0].Wp_Uur[1] ? block[0].Wp_Uur[1] * 30 / 60 : block[0].Wp_Uur[0] * 30 / 60
        const start = startTime === 0 ? "00:00" : moment.duration(startTime, 'hours').format('h:mm')
        const end = endTime === 24 ? "23:59" : moment.duration(endTime, 'hours').format('h:mm')
        const recurringEvery = block[0].Wp_Pct === 50 ? 2 : 1
        const base = moment('2017-01-01')
        let startDate = base.add(dow, 'day').valueOf()
        if (recurringEvery === 2) startDate = base.add(1, 'week').valueOf()

        const newObj = {
          dow,
          start,
          end,
          startDate,
          recurringEvery,
          type: 1,
          isRecurring: 1,
          startTime,
          endTime,
          clientId,
          freelancerId: null,
          created,
          productCategoryId: 11,
          hasEndDate: false,
          deliveries: []
        }
        block.forEach(freelancer => {
          if (freelancer.Wp_Mdw_ID) {
            newObj.deliveries.push(
              Object.assign({}, newObj, { freelancerId: freelancer.Wp_Mdw_ID, type: 2, deliveries: null })
            )
          }
        })
        newJSON.push(newObj)
      })
    }
  }

  return newJSON
}

module.exports = format
