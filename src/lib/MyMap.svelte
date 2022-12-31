<script>
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/environment'
  import { stores, pos } from '../store.js'

  import logo from '$lib/assets/AEONMALL.png'

  let mapElement
  let map

  const basePos = [36.327665, 136.305237] // 地図の中心ポイント

  onMount(async () => {
    if (browser) {
      const leaflet = await import('leaflet')
      map = leaflet.map(mapElement).setView(basePos, 5)
      const mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>'
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; ' + mapLink,
          minZoom: 5,
        })
        .addTo(map)

      const greenIcon = leaflet.icon({
        iconUrl: logo,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      for (const store of $stores) {
        leaflet
          .marker([store.lat, store.lng], { icon: greenIcon })
          .addTo(map)
          .on('click', (ev) => {
            console.log(store)
            pos.set([store.lat, store.lng])
            leaflet
              .popup()
              .setLatLng(ev.latlng)
              .setContent(
                `<p>店舗名：${store.store_name}</p><p>ブランド：${store.brand}</p><p>運営会社：${store.company}</p><p>所在地：${store.address}</p>`
              )
              .openOn(map)
          })
      }
    }
  })

  onDestroy(async () => {
    if (map) {
      map.remove()
    }
  })

  // $pos の watch
  $: {
    if (typeof map !== 'undefined') {
      if ($pos[0] === basePos[0] && $pos[1] === basePos[1]) {
        // 初期表示位置
        map.setView($pos, 5)
      } else {
        // 店舗フォーカス
        map.setView($pos, 13)
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
