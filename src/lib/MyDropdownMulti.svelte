<script>
  import { createEventDispatcher } from 'svelte'
  import { Dropdown, DropdownDivider, Chevron, Checkbox } from 'flowbite-svelte'
  import { Funnel } from 'svelte-heros-v2'

  const dispatch = createEventDispatcher()

  export let label = ''
  export let dropListParent = []
  export let dropListChild = []

  let parentGroup = []
  let childGroup = []
  let childOpenStats = {}

  const dropListChildText = (parent) => {
    return dropListChild.filter((x) => x.parent === parent.text).map((x) => x.text)
  }

  /* 親向けの処理 */
  function clearAllParent() {
    parentGroup.length = 0
    childGroup.length = 0
  }
  function onChangeParent(parent) {
    // parent ON/OFF に同期して配下の全childを ON/OFF
    if (parentGroup.includes(parent.text)) {
      // ON
      childGroup = [...new Set([...childGroup, ...dropListChildText(parent)])]
    } else {
      // OFF
      childGroup = childGroup.filter((x) => !dropListChildText(parent).includes(x))
    }
  }
  function parentHoverHandler(hoverParent) {
    // parent行のhoverでchildドロップリスト表示
    for (const parent of dropListParent) {
      childOpenStats[parent.text] = parent.text === hoverParent.text
    }
  }

  /* 子向けの処理 */
  function clearAllChild(parent) {
    childGroup = childGroup.filter((x) => !dropListChildText(parent).includes(x))
    parentGroup = parentGroup.filter((x) => x !== parent.text)
  }
  function onChangeChild(parent, child) {
    if (childGroup.includes(child.text)) {
      // ON
      parentGroup = [...new Set([...parentGroup, parent.text])]
    } else {
      // OFF
      for (const childText of dropListChildText(parent)) {
        if (childGroup.includes(childText)) {
          return
        }
      }
      parentGroup = parentGroup.filter((x) => x !== parent.text)
    }
  }

  $: {
    for (const item of dropListChild) {
      item.checked = childGroup.includes(item.text)
    }
    dispatch('updateChild', dropListChild)
  }
</script>

<div class="flex items-center whitespace-nowrap">
  <p class="pr-2">{label}</p>
  <Funnel size="14" variation={parentGroup.length === 0 ? 'outline' : 'solid'} />
</div>
<Dropdown class="max-h-60 overflow-x-auto py-3 text-sm">
  <li>
    <div
      class="flex items-center justify-center hover:underline text-red-700"
      on:click={clearAllParent}
    >
      CLEAR ALL
    </div>
  </li>
  <DropdownDivider />
  {#each dropListParent as parent}
    {#if dropListChild
      .filter((x) => x.enable)
      .map((x) => x.parent)
      .includes(parent.text)}
      <li class="px-3 hover:bg-gray-200" on:mouseenter={parentHoverHandler(parent)}>
        <Checkbox bind:group={parentGroup} value={parent.text} on:change={onChangeParent(parent)}>
          <Chevron placement="right">{parent.text} ({parent.count})</Chevron>
        </Checkbox>
      </li>
      <Dropdown placement="right-start" bind:open={childOpenStats[parent.text]}>
        <li>
          <div
            class="flex items-center justify-center hover:underline text-red-700"
            on:click={clearAllChild(parent)}
          >
            CLEAR ALL
          </div>
        </li>
        <DropdownDivider />
        {#each dropListChild as child}
          {#if child.parent === parent.text && child.enable}
            <li class="px-3 hover:bg-gray-200">
              <Checkbox
                bind:group={childGroup}
                value={child.text}
                on:change={onChangeChild(parent, child)}
              >
                {child.text} ({child.count})
              </Checkbox>
            </li>
          {/if}
        {/each}
      </Dropdown>
    {/if}
  {/each}
</Dropdown>
