<script>
  import { onMount, onDestroy } from 'svelte'
  import L from 'leaflet'
  import { browser } from '$app/environment'

  import { filteredStores, selectedStore, brandColors } from '../stores.js'

  import ICON_AEONMALL from '$lib/assets/aeon_mall.ico'
  import ICON_AEON from '$lib/assets/aeon.ico'
  import ICON_AEONSTYLE from '$lib/assets/aeon_style.ico'
  import ICON_AEONTOWN from '$lib/assets/aeon_town.ico'
  import ICON_MAXVALU from '$lib/assets/maxvalu.ico'
  import ICON_BIG from '$lib/assets/big.ico'

  let map
  let mapElement

  // marker 関連
  const centerPos = [36.327665, 136.305237] // 地図の中心ポイント
  let mapMarkers = {}
  //表示範囲設定 左上：右下
  const maxBounds = [
    [46, 120],
    [24, 150],
  ]

  // icon 関連
  const maxIconSize = 40
  const minIconSize = 16
  const mapIcons = []
  let mapDotIcon

  // zoom 関連
  const maxZoom = 13
  const minZoom = 5
  const switchIconZoom = 10
  let currentZoom = minZoom

  onMount(async () => {
    if (browser) {
      map = L.map(mapElement, { maxBounds })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        minZoom,
      }).addTo(map)

      // zoom イベント
      map.on('zoom', (ev) => {
        currentZoom = ev.target._zoom
      })

      // マーカーアイコン定義
      mapDotIcon = L.divIcon({ html: '<div class="flex justify-center">●</div>' })
      mapIcons['イオン'] = L.icon({ iconUrl: ICON_AEON })
      mapIcons['イオンモール'] = L.icon({ iconUrl: ICON_AEONMALL })
      mapIcons['イオンスタイル'] = L.icon({ iconUrl: ICON_AEONSTYLE })
      mapIcons['イオンタウン'] = L.icon({ iconUrl: ICON_AEONTOWN })
      mapIcons['マックスバリュ'] = L.icon({ iconUrl: ICON_MAXVALU })
      mapIcons['ザ・ビッグ'] = L.icon({ iconUrl: ICON_BIG })

      // 初期表示位置を日本の中心に設定
      map.setView(centerPos, minZoom)
    }
  })

  onDestroy(async () => {
    if (map) {
      map.remove()
    }
  })

  // $selectedStore の watch
  $: focusStore($selectedStore)
  function focusStore(store) {
    if (map && store) {
      // ポップアップ
      mapMarkers[store.store_name].openPopup()
      // 店舗フォーカス
      map.setView([store.lat, store.lng])
    }
  }

  // マーカー処理
  $: {
    if (map) {
      // 既存マーカークリア
      for (const key in mapMarkers) {
        map.removeLayer(mapMarkers[key])
      }

      const iconSize = ((maxIconSize - minIconSize) / (maxZoom - minZoom)) * currentZoom
      mapMarkers.length = {}

      // 新規マーカーセット
      for (const store of $filteredStores) {
        let icon
        if (currentZoom < switchIconZoom || !mapIcons[store.brand]) {
          icon = mapDotIcon
          let className = $brandColors[store.brand]
          if (currentZoom > 11) {
            className += ' text-6xl'
          } else if (currentZoom > 9) {
            className += ' text-4xl'
          } else if (currentZoom > 7) {
            className += ' text-2xl'
          } else {
            className += ' text-base'
          }
          icon.options.className = className
        } else {
          icon = mapIcons[store.brand]
        }
        icon.options.iconSize = [iconSize, iconSize]
        icon.options.iconAnchor = [iconSize / 2, iconSize / 2]

        const mapMarker = L.marker([store.lat, store.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<p class="!m-0">店舗名：${store.store_name}</p>` +
              `<p class="!m-0">ブランド：${store.brand}</p>` +
              `<p class="!m-0">運営会社：${store.company}</p>` +
              `<p class="!m-0">所在地：${store.address}</p>`
          )
          .on('click', () => {
            selectedStore.set(store)
          })
        mapMarkers[store.store_name] = mapMarker
      }
    }
  }
</script>

<div class="my-map">
  <div bind:this={mapElement} />
</div>

<style>
  @import 'leaflet/dist/leaflet.css';
  .my-map div {
    height: 580px;
    width: 100%;
  }
</style>
