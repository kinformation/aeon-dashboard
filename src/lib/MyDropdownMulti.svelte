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
  let openChildren = {}

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
  function setParentCheckboxStatus(parent) {
    const parentCheckbox = document.querySelector(`input[type='checkbox'][value='${parent.text}']`)
    const childCount = dropListChildText(parent).reduce((count, x) => {
      return (count += childGroup.includes(x) ? 1 : 0)
    }, 0)

    if (childCount === 0) {
      parentCheckbox.indeterminate = false
      parentCheckbox.checked = false
    } else if (childCount === dropListChildText(parent).length) {
      parentCheckbox.indeterminate = false
      parentCheckbox.checked = true
    } else {
      parentCheckbox.indeterminate = true
      parentCheckbox.checked = false
    }
  }

  /* 子向けの処理 */
  function clearAllChild(parent) {
    childGroup = childGroup.filter((x) => !dropListChildText(parent).includes(x))
    parentGroup = parentGroup.filter((x) => x !== parent.text)
  }
  function onChangeChild(parent) {
    // 子の選択状態によって親のチェックボックス状態を更新
    setParentCheckboxStatus(parent)
  }

  $: {
    dispatch('updateChild', dropListChild)
  }

  $: {
    parentGroup = dropListParent.filter((x) => x.checked && x.enable).map((x) => x.text)
    childGroup = dropListChild.filter((x) => x.checked && x.enable).map((x) => x.text)
  }
</script>

<div class="flex items-center whitespace-nowrap">
  <p class="pr-2">{label}</p>
  <Funnel size="14" variation={childGroup.length === 0 ? 'outline' : 'solid'} />
</div>
<Dropdown class="max-h-60 overflow-x-auto py-3 text-sm">
  <li>
    <div
      class="flex items-center justify-center hover:underline text-red-700"
      on:click={clearAllParent}
      on:keypress={clearAllParent}
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
      <li class="px-3 hover:bg-gray-200" on:show={setParentCheckboxStatus(parent)}>
        <Checkbox bind:group={parentGroup} value={parent.text} on:change={onChangeParent(parent)}>
          <Chevron placement="right">{parent.text} ({parent.count})</Chevron>
        </Checkbox>
      </li>
      <Dropdown placement="right-start" trigger="hover" bind:open={openChildren[parent.text]}>
        <li>
          <div
            class="flex items-center justify-center hover:underline text-red-700"
            on:click={clearAllChild(parent)}
            on:keypress={clearAllChild(parent)}
          >
            CLEAR ALL
          </div>
        </li>
        <DropdownDivider />
        {#each dropListChild as child}
          {#if child.parent === parent.text && child.enable}
            <li class="px-3 hover:bg-gray-200">
              <Checkbox
                bind:checked={child.checked}
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
