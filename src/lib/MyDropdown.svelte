<script>
  import { createEventDispatcher } from 'svelte'
  import { Chevron, Dropdown, DropdownDivider, Checkbox } from 'flowbite-svelte'

  const dispatch = createEventDispatcher()

  export let label = ''
  export let dropList = []

  let group = []

  function clearAll() {
    group.length = 0
  }

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
<Dropdown class="max-h-60 overflow-x-auto py-3 space-y-1 text-sm">
  <li>
    <div class="flex items-center justify-center hover:underline text-red-700" on:click={clearAll}>
      CLEAR ALL
    </div>
  </li>
  <DropdownDivider />
  {#each dropList as item}
    {#if item.enable}
      <li class="px-3 hover:bg-sky-500/75">
        <Checkbox bind:group value={item.text}>{item.text}</Checkbox>
      </li>
    {/if}
  {/each}
</Dropdown>

<style>
</style>
