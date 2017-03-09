const getTimeBlocks = (data) => {
  for (const client in data) {
    for (const day in data[client]) {
      const timeblocks = Object.keys(data[client][day]).reduce((a,b,i,array) => {
        if (i == 0 || array[i-1] != b-1 || i === array.length-1) {
          const blockdata = data[client][day][b]
          if (i != 0) {
            a[a.length-1].forEach(block => {
              if (i === array.length-1) block.Wp_Uur.push(array[i])
              else block.Wp_Uur.push(array[i-1])
            })
          }
          if (i !== array.length-1) {
            blockdata.forEach(block => block.Wp_Uur = [])
            a.push(blockdata)
            a[a.length-1].forEach(block => block.Wp_Uur.push(b))
          }

        }
        return a
      }, [])
      data[client][day] = timeblocks
    }
  }
  return data
}

module.exports = getTimeBlocks
