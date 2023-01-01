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
  import { stores, selectedStores, currentPos } from '../stores.js'

  // <--- init
  // プルダウンメニュー生成処理
  const createDropDownList = (key) => {
    return [...new Set($stores.map((x) => x[key]))].map((x) => {
      return { text: x, checked: false, enable: true }
    })
  }
  const regions = createDropDownList('region')
  const prefs = createDropDownList('pref')
  const brands = createDropDownList('brand')
  const companies = createDropDownList('company')

  // 全店舗を初期表示に設定
  selectedStores.set($stores)

  // init --->

  function onRowClick(latLng) {
    currentPos.set(latLng)
  }

  function filter() {
    const checkedRegions = regions.filter((x) => x.checked).map((x) => x.text)
    const checkedPref = prefs.filter((x) => x.checked).map((x) => x.text)
    const checkedBrad = brands.filter((x) => x.checked).map((x) => x.text)
    const checkedCompany = companies.filter((x) => x.checked).map((x) => x.text)

    selectedStores.set(
      $stores.filter((x) => {
        if (checkedRegions.length > 0 && !checkedRegions.includes(x.region)) return false
        if (checkedPref.length > 0 && !checkedPref.includes(x.pref)) return false
        if (checkedBrad.length > 0 && !checkedBrad.includes(x.brand)) return false
        if (checkedCompany.length > 0 && !checkedCompany.includes(x.company)) return false
        return true
      })
    )
  }

  // $: {
  //   const updateDropDownList = (list, key) => {
  //     for (const item of list) {
  //       item.enable = $selectedStores.map((x) => x[key]).includes(item.text)
  //       if (!item.enable) item.checked = false
  //     }
  //   }
  //   updateDropDownList(regions, 'region')
  //   updateDropDownList(prefs, 'pref')
  //   updateDropDownList(brands, 'brand')
  //   updateDropDownList(companies, 'company')
  // }
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
      {#each $selectedStores as store}
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
    max-height: 35vh;
    min-height: 35vh;
    max-width: calc(100vw - 32px);
  }
</style>
