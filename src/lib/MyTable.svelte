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
  import MyDropdownMulti from './MyDropdownMulti.svelte'
  import MyDropdownSearch from './MyDropdownSearch.svelte'
  import { stores, filteredStores, selectedStore } from '../stores.js'

  // <--- init
  // プルダウンメニュー生成処理
  const createDropDownList = (key) => {
    return [...new Set($stores.map((x) => x[key]))].map((x) => {
      return { text: x, count: 0, checked: false, enable: true }
    })
  }
  const regions = createDropDownList('region')
  const prefs = createDropDownList('pref')
  const brands = createDropDownList('brand')
  const companies = createDropDownList('company')

  // prefs に regions を紐づけ
  // 地域と都道府県の対応表 {都道府県名: 地域名,...}
  const regionPref = [
    ...new Map($stores.map((x) => [x.pref, { [x.pref]: x.region }])).values(),
  ].reduce((obj, item) => {
    return Object.assign(obj, item)
  }, {})
  prefs.map((x) => (x.parent = regionPref[x.text]))

  // 全店舗を初期表示に設定
  filteredStores.set($stores)
  filter()
  // init --->

  function onRowClick(store) {
    selectedStore.set(store)
  }

  function filter() {
    const checkedRegion = regions.filter((x) => x.checked).map((x) => x.text)
    const checkedPref = prefs.filter((x) => x.checked).map((x) => x.text)
    const checkedBrad = brands.filter((x) => x.checked).map((x) => x.text)
    const checkedCompany = companies.filter((x) => x.checked).map((x) => x.text)

    filteredStores.set(
      $stores.filter((x) => {
        if (checkedRegion.length > 0 && !checkedRegion.includes(x.region)) return false
        if (checkedPref.length > 0 && !checkedPref.includes(x.pref)) return false
        if (checkedBrad.length > 0 && !checkedBrad.includes(x.brand)) return false
        if (checkedCompany.length > 0 && !checkedCompany.includes(x.company)) return false
        return true
      })
    )

    // ドロップダウンメニュー更新
    const updateDropDownList = (list, key) => {
      const base = $stores.filter((x) => {
        if (key !== 'region' && checkedRegion.length > 0 && !checkedRegion.includes(x.region)) {
          return false
        }
        if (key !== 'pref' && checkedPref.length > 0 && !checkedPref.includes(x.pref)) {
          return false
        }
        if (key !== 'brand' && checkedBrad.length > 0 && !checkedBrad.includes(x.brand)) {
          return false
        }
        if (key !== 'company' && checkedCompany.length > 0 && !checkedCompany.includes(x.company)) {
          return false
        }
        return true
      })
      for (const item of list) {
        item.enable = base.map((x) => x[key]).includes(item.text)
        if (item.enable) {
          item.count = base.filter((x) => x[key] === item.text).length
        } else {
          item.checked = false
        }
      }
    }
    updateDropDownList(regions, 'region')
    updateDropDownList(prefs, 'pref')
    updateDropDownList(brands, 'brand')
    updateDropDownList(companies, 'company')
  }
</script>

<Table hoverable shadow>
  <div class="my-table block overflow-auto">
    <TableHead theadClass="text-sm sticky top-0 z-30">
      <TableHeadCell>
        <MyDropdownMulti
          label="地域"
          dropListParent={regions}
          dropListChild={prefs}
          on:updateChild={filter}
        />
      </TableHeadCell>
      <TableHeadCell>
        <MyDropdownMulti
          label="都道府県"
          dropListParent={regions}
          dropListChild={prefs}
          on:updateChild={filter}
        />
      </TableHeadCell>
      <TableHeadCell>
        <MyDropdown label="ブランド" dropList={brands} on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>
        <MyDropdownSearch label="店舗名" on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>
        <MyDropdown label="運営会社" dropList={companies} on:updateChild={filter} />
      </TableHeadCell>
      <TableHeadCell>所在地</TableHeadCell>
    </TableHead>

    <TableBody>
      {#each $filteredStores as store}
        <TableBodyRow
          trClass="hover:!bg-gray-200 {$selectedStore === store ? 'bg-sky-500/75' : ''}"
          on:click={onRowClick(store)}
        >
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
