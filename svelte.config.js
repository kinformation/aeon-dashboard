import preprocess from 'svelte-preprocess'
import azure from 'svelte-adapter-azure-swa'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: azure(),
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
}

export default config
