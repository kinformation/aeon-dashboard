<script>
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/environment'
  import { selectedStores, currentPos } from '../stores.js'

  // import ICON_AEONMALL from '$lib/assets/AEONMALL.png'
  // import ICON_AEON from '$lib/assets/AEON.png'
  // import ICON_AEONSTYLE from '$lib/assets/AEONSTYLE.jpg'

  import ICON_AEONMALL from '$lib/assets/aeon_mall.ico'
  import ICON_AEON from '$lib/assets/aeon.ico'
  import ICON_AEONSTYLE from '$lib/assets/aeon_style.ico'
  import ICON_AEONTOWN from '$lib/assets/aeon_town.ico'

  let leaflet
  let map
  let mapElement

  // marker 関連
  const centerPos = [36.327665, 136.305237] // 地図の中心ポイント
  let mapMarkers = []

  // icon 関連
  const maxIconSize = 40
  const minIconSize = 16
  const mapIcons = []
  let mapDotIcon
  const brandColors = {
    イオン: 'text-red-600',
    イオンモール: 'text-orange-400',
    イオンスタイル: 'text-yellow-300',
    イオンタウン: 'text-lime-400',
  }

  // zoom 関連
  const maxZoom = 13
  const minZoom = 5
  const switchIconZoom = 10
  let currentZoom = minZoom

  onMount(async () => {
    if (browser) {
      leaflet = await import('leaflet')
      map = leaflet.map(mapElement)
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
          minZoom,
        })
        .addTo(map)

      // zoom イベント
      map.on('zoom', (ev) => {
        currentZoom = ev.target._zoom
      })

      // マーカーアイコン定義
      mapDotIcon = leaflet.divIcon({ html: '●' })
      mapIcons['イオン'] = leaflet.icon({ iconUrl: ICON_AEON })
      mapIcons['イオンモール'] = leaflet.icon({ iconUrl: ICON_AEONMALL })
      mapIcons['イオンスタイル'] = leaflet.icon({ iconUrl: ICON_AEONSTYLE })
      mapIcons['イオンタウン'] = leaflet.icon({ iconUrl: ICON_AEONTOWN })

      // 初期表示位置を日本の中心に設定
      $currentPos = centerPos
    }
  })

  onDestroy(async () => {
    if (map) {
      map.remove()
    }
  })

  // $currentPos の watch
  $: {
    if (typeof map !== 'undefined') {
      if (JSON.stringify($currentPos) === JSON.stringify(centerPos)) {
        // 初期表示位置
        map.setView($currentPos, minZoom)
      } else {
        // 店舗フォーカス
        map.setView($currentPos)
      }
    }
  }

  // マーカー処理
  $: {
    if (typeof map !== 'undefined') {
      // 既存マーカークリア
      for (const mapMarker of mapMarkers) {
        map.removeLayer(mapMarker)
      }

      const iconSize = ((maxIconSize - minIconSize) / (maxZoom - minZoom)) * currentZoom
      mapMarkers.length = 0

      // 新規マーカーセット
      for (const store of $selectedStores) {
        let icon
        if (currentZoom < switchIconZoom) {
          icon = mapDotIcon
          let className = brandColors[store.brand]
          if (currentZoom > 13) {
            className += ' text-9xl'
          } else if (currentZoom > 11) {
            className += ' text-8xl'
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

        const mapMarker = leaflet
          .marker([store.lat, store.lng], { icon })
          .addTo(map)
          .on('click', (ev) => {
            currentPos.set([store.lat, store.lng])
            leaflet
              .popup()
              .setLatLng(ev.latlng)
              .setContent(
                `<p>店舗名：${store.store_name}</p><p>ブランド：${store.brand}</p><p>運営会社：${store.company}</p><p>所在地：${store.address}</p>`
              )
              .openOn(map)
          })
        mapMarkers.push(mapMarker)
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
