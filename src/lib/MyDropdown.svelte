<script>
  import { createEventDispatcher } from 'svelte'
  import { Chevron, Dropdown, Checkbox } from 'flowbite-svelte'

  const dispatch = createEventDispatcher()

  export let label = ''
  export let dropList = []

  let group = []

  $: {
    for (const item of dropList) {
      item.checked = group.includes(item.text)
    }
    dispatch('updateChild', dropList)
  }
</script>

<div class="flex items-center whitespace-nowrap">
  <Chevron>{label}</Chevron>
</div>
<Dropdown class="py-3 space-y-1 text-sm">
  {#each dropList as item}
    <li class="px-3 hover:bg-sky-500/75">
      <Checkbox bind:group value={item.text}>{item.text}</Checkbox>
    </li>
  {/each}
</Dropdown>

<style>
</style>
