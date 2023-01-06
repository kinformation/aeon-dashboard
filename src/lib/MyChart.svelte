<script>
  import Chart from 'svelte-frappe-charts'

  import { filteredStores } from '../stores.js'

  let data

  $: {
    const dataset = $filteredStores.reduce(function (prev, current) {
      prev[current.region] = (prev[current.region] || 0) + 1
      return prev
    }, {})

    data = {
      labels: Object.keys(dataset),
      datasets: [
        {
          values: Object.values(dataset),
        },
      ],
    }
  }
</script>

<Chart {data} type="pie" maxSlices="10" height="400" />
