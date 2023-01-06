<script>
  import { Dropdown, Search } from 'flowbite-svelte'
  import { MagnifyingGlass } from 'svelte-heros-v2'

  import { filteredStores, selectedStore } from '../stores.js'

  export let label = ''

  let value = ''
  let dropList = []

  $: {
    dropList = $filteredStores.filter((x) => x.store_name.indexOf(value) > -1)
  }

  function onClick(store) {
    selectedStore.set(store)
  }
</script>

<div class="flex items-center whitespace-nowrap">
  <p class="pr-2">{label}</p>
  <MagnifyingGlass size="14" />
</div>
<Dropdown class="max-h-60 overflow-x-auto py-3 text-sm">
  <div slot="header" class="p-3">
    <Search bind:value size="sm" />
  </div>
  {#each dropList as store}
    <li class="px-3 hover:bg-gray-200" on:click={onClick(store)}>
      {store.store_name}
    </li>
  {/each}
</Dropdown>
