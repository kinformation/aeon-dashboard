// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  stores: {
    async get() {
      // const { data } = await supabase.from('stores').select('*')
      // return data
      console.log(import.meta.env)
      console.log(process.env)
      console.log(process.env)
      return [
        {
          id: 2,
          region: '北海道地方',
          pref: '北海道',
          brand: 'イオン',
          store_name: 'イオン札幌桑園店',
          company: 'イオン北海道株式会社',
          address: '北海道札幌市中央区北8条西14-28',
          lng: 141.33367451,
          lat: 43.06852979,
        },
      ]
    },
  },
}
