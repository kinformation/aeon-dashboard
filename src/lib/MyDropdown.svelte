<script>
  import { createEventDispatcher } from 'svelte'
  import { Dropdown, DropdownDivider, Checkbox } from 'flowbite-svelte'
  import { Funnel } from 'svelte-heros-v2'

  import { brandColors } from '../stores.js'

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
  <p class="pr-2">{label}</p>
  <Funnel size="14" variation={group.length === 0 ? 'outline' : 'solid'} />
</div>
<Dropdown class="max-h-60 overflow-x-auto py-3 text-sm">
  <li>
    <div
      class="flex items-center justify-center hover:underline text-red-700"
      on:click={clearAll}
      on:keypress={clearAll}
    >
      CLEAR ALL
    </div>
  </li>
  <DropdownDivider />
  {#each dropList as item}
    {#if item.enable}
      <li class="px-3 hover:bg-gray-200">
        <Checkbox bind:group value={item.text}
          >{#if $brandColors[item.text]}<p class="dot-icon pr-1 {$brandColors[item.text]}">
              ●
            </p>{/if}
          {item.text} ({item.count})</Checkbox
        >
      </li>
    {/if}
  {/each}
</Dropdown>

<style>
  .dot-icon {
    font-size: 4px;
  }
</style>
