import { readable, writable, derived } from 'svelte/store'

export const storesRow = writable([])

export const stores = derived(storesRow, ($storesRow) =>
  $storesRow.filter((x) =>
    [
      // 'イオンショッピングセンター',
      'イオン',
      // 'マックスバリュ',
      // 'フ－ドセンタ－',
      'イオンモール',
      'ザ・ビッグ',
      // 'イオンスーパーセンター',
      'イオンタウン',
      // 'サンデー',
      'イオンスタイル',
      // 'キッズリパブリック',
      // 'オーパ',
      // 'フォ－ラス',
      // 'イオンエクスプレス',
      // 'イオンバイク',
      // 'アコレ',
      // 'まいばすけっと',
      // 'R.O.U',
      // 'マックスバリュエクスプレス',
      // 'ダイエー',
      // 'ボンベルタ',
      // 'PEACOCK STORE',
      // 'イオンリカー',
      // 'ビブレ',
      // 'ワールドポーターズ',
      // 'イオン・イオンスタイル',
      // 'そよら',
      // 'ミセススマート',
      // 'KOHYO',
      // 'ザ・ビッグエクストラ',
      // 'マルナカ',
      // 'HOME COORDY',
      // 'ホームワイド',
      // 'レッドキャベツ',
      // 'イオンドラッグ',
    ].includes(x.brand)
  )
)

export const filteredStores = writable([])

export const selectedStore = writable()

export const brandColors = readable({
  イオン: 'text-red-600',
  イオンモール: 'text-orange-400',
  イオンスタイル: 'text-yellow-300',
  イオンタウン: 'text-lime-400',
  マックスバリュ: 'text-green-600',
  'ザ・ビッグ': 'text-cyan-600',
  // text-blue-600
  // text-indigo-600
  // text-purple-600
  // text-pink-600
  // text-gray-600
})
