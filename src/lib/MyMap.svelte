<script>
  import { onMount, onDestroy } from 'svelte'
  import L from 'leaflet'
  import { MarkerClusterGroup } from 'leaflet.markercluster'
  import { EasyButton } from '$lib/easy-button/easy-button'

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
  let markerLayer
  let markerClusterGroup
  let enableCluster = false

  // icon 関連
  const maxIconSize = 40
  const minIconSize = 16
  const mapIcons = []

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
      mapIcons['イオン'] = L.icon({ iconUrl: ICON_AEON })
      mapIcons['イオンモール'] = L.icon({ iconUrl: ICON_AEONMALL })
      mapIcons['イオンスタイル'] = L.icon({ iconUrl: ICON_AEONSTYLE })
      mapIcons['イオンタウン'] = L.icon({ iconUrl: ICON_AEONTOWN })
      mapIcons['マックスバリュ'] = L.icon({ iconUrl: ICON_MAXVALU })
      mapIcons['ザ・ビッグ'] = L.icon({ iconUrl: ICON_BIG })

      // leaflet.markercluster プラグイン読み込み
      markerClusterGroup = new MarkerClusterGroup({
        showCoverageOnHover: false,
        disableClusteringAtZoom: 8,
        maxClusterRadius: 50,
      })

      // leaflet.EasyButton プラグイン読み込み
      EasyButton(L)
      L.easyButton('fa-object-group', function () {
        enableCluster = !enableCluster
      }).addTo(map)

      // マーカーレイヤの初期状態をクラスタなしに設定
      markerLayer = L.layerGroup()

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
      mapMarkers[store.id].openPopup()
      // 店舗フォーカス
      map.setView([store.lat, store.lng])
    }
  }

  // マーカー処理
  $: {
    if (map) {
      // 既存マーカークリア
      map.removeLayer(markerLayer)
      for (const id in mapMarkers) {
        markerLayer.removeLayer(mapMarkers[id])
      }
      mapMarkers = {}

      markerLayer = enableCluster ? markerClusterGroup : L.layerGroup()

      // 新規マーカーセット
      for (const store of $filteredStores) {
        let icon
        if (currentZoom < switchIconZoom || !mapIcons[store.brand]) {
          let circleStyle = $brandColors[store.brand]
          if (currentZoom > 11) {
            circleStyle += ' text-6xl'
          } else if (currentZoom > 9) {
            circleStyle += ' text-4xl'
          } else if (currentZoom > 7) {
            circleStyle += ' text-2xl'
          } else {
            circleStyle += ' text-base'
          }
          icon = L.divIcon({
            html: `<div class="flex justify-center ${circleStyle}">●</div>`,
            className: '',
          })
        } else {
          icon = mapIcons[store.brand]
          // zoom レベルによってアイコンサイズ変更
          const iconSize = ((maxIconSize - minIconSize) / (maxZoom - minZoom)) * currentZoom
          icon.options.iconSize = [iconSize, iconSize]
          icon.options.iconAnchor = [iconSize / 2, iconSize / 2]
        }

        const mapMarker = L.marker([store.lat, store.lng], { icon })
          .addTo(markerLayer)
          .bindPopup(
            `<p class="!m-0">店舗名：${store.store_name}</p>` +
              `<p class="!m-0">ブランド：${store.brand}</p>` +
              `<p class="!m-0">運営会社：${store.company}</p>` +
              `<p class="!m-0">所在地：${store.address}</p>`
          )
          .on('click', () => {
            selectedStore.set(store)
          })
        mapMarkers[store.id] = mapMarker
      }
      map.addLayer(markerLayer)
    }
  }
</script>

<div class="my-map">
  <div bind:this={mapElement} />
</div>

<svelte:head>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
  <script defer src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"></script>
</svelte:head>

<style>
  @import 'leaflet/dist/leaflet.css';
  @import 'leaflet.markercluster/dist/MarkerCluster.css';
  @import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
  @import '$lib/easy-button/easy-button.css';
  .my-map div {
    height: 580px;
    width: 100%;
  }
</style>
