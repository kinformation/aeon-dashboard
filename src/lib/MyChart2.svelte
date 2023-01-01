<script>
  import Chart from 'svelte-frappe-charts'

  import { selectedStores } from '../stores.js'

  let data

  $: {
    const dataset = $selectedStores.reduce(function (prev, current) {
      prev[current.brand] = (prev[current.brand] || 0) + 1
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
