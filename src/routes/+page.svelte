<script>
  import MyTable from '$lib/MyTable.svelte'
  import MyMap from '$lib/MyMap.svelte'
  import MyChart from '$lib/MyChart.svelte'
  import MyChart2 from '$lib/MyChart2.svelte'
</script>

<main class="p-4">
  <div class="grid grid-cols-4 gap-4">
    <div class="grid col-span-4">
      <div class="table-area">
        <MyTable />
      </div>
    </div>
    <div class="grid col-span-4 lg:col-span-2">
      <div class="map-area">
        <MyMap />
      </div>
    </div>
    <div class="grid col-span-2 lg:col-span-1">
      <MyChart />
    </div>
    <div class="grid col-span-2 lg:col-span-1">
      <MyChart2 />
    </div>
  </div>
</main>

<style>
</style>
