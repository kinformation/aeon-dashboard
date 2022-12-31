<script>
  import MyTable from '$lib/MyTable.svelte'
  import MyMap from '$lib/MyMap.svelte'
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
      <div class="chart1-area text-3xl font-bold underline">.col</div>
    </div>
    <div class="grid col-span-2 lg:col-span-1">
      <div class="chart2-area">.col</div>
    </div>
  </div>
</main>

<style>
  .chart1-area {
    background-color: darkorange;
  }
  .chart2-area {
    background-color: chartreuse;
  }
</style>
