<script>
  import { onMount } from 'svelte'
  import { storesRow, stores } from '../stores.js'
  import supabase from '../supabase.js'

  import MyTable from '$lib/MyTable.svelte'
  import MyMap from '$lib/MyMap.svelte'
  import MyChart from '$lib/MyChart.svelte'
  import MyChart2 from '$lib/MyChart2.svelte'

  onMount(async () => {
    // supabase DB より店舗情報取得
    storesRow.set(await supabase.stores.get())
  })
</script>

{#if $stores.length > 0}
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
{/if}

<style>
</style>
