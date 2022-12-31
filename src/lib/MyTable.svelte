<script>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte'

  import MyDropdown from '$lib/MyDropdown.svelte'
  import { stores, storesOrg, pos } from '../store.js'

  const regions = [...new Set($storesOrg.map((x) => x.region))].map((x) => {
    return { text: x, checked: false, enable: true }
  })
  const prefs = [...new Set($storesOrg.map((x) => x.pref))].map((x) => {
    return { text: x, checked: false, enable: true }
  })
  const brands = [...new Set($storesOrg.map((x) => x.brand))].map((x) => {
    return { text: x, checked: false, enable: true }
  })
  const companies = [...new Set($storesOrg.map((x) => x.company))].map((x) => {
    return { text: x, checked: false, enable: true }
  })

  function onRowClick(latLng) {
    pos.set(latLng)
  }

  function filter() {
    const checkedRegions = regions.filter((x) => x.checked).map((x) => x.text)
    const checkedPref = prefs.filter((x) => x.checked).map((x) => x.text)
    const checkedBrad = brands.filter((x) => x.checked).map((x) => x.text)
    const checkedCompany = companies.filter((x) => x.checked).map((x) => x.text)

    const filteredStores = $storesOrg.filter((x) => {
      if (checkedRegions.length > 0 && !checkedRegions.includes(x.region)) return false
      if (checkedPref.length > 0 && !checkedPref.includes(x.pref)) return false
      if (checkedBrad.length > 0 && !checkedBrad.includes(x.brand)) return false
      if (checkedCompany.length > 0 && !checkedCompany.includes(x.company)) return false
      return true
    })

    stores.set(filteredStores)
  }
</script>

<Table hoverable shadow>
  <div class="my-table block overflow-auto">
    <TableHead theadClass="text-sm sticky top-0 z-30">
      <TableHeadCell>
        <MyDropdown label="地域" dropList={regions} on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>
        <MyDropdown label="都道府県" dropList={prefs} on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>
        <MyDropdown label="ブランド" dropList={brands} on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>店舗名</TableHeadCell>
      <TableHeadCell>
        <MyDropdown label="運営会社" dropList={companies} on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>所在地</TableHeadCell>
    </TableHead>

    <TableBody>
      {#each $stores as store}
        <TableBodyRow trClass="hover:!bg-gray-200" on:click={onRowClick([store.lat, store.lng])}>
          {#each ['region', 'pref', 'brand', 'store_name', 'company', 'address'] as item}
            <TableBodyCell tdClass="p-1 whitespace-nowrap font-medium text-sm"
              >{store[item]}</TableBodyCell
            >
          {/each}
        </TableBodyRow>
      {/each}
    </TableBody>
  </div>
</Table>

<style>
  .my-table {
    height: 35vh;
  }
</style>
