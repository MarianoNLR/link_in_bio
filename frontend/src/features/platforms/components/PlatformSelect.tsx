import { createElement, type Ref } from 'react'
import { Select } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { getPlatformIcon } from '../lib/platform-icons'
import type { Platform } from '../types/platform.types'

type PlatformSelectProps = {
  id: string
  name: string
  platforms: Platform[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onBlur?: () => void
  ref?: Ref<HTMLButtonElement>
  invalid?: boolean
}

export function PlatformSelect({
  id, name, platforms, value, defaultValue, onValueChange, onBlur, ref, invalid,
}: PlatformSelectProps) {
  const items = [
    { value: '', name: 'Link personalizado', slug: undefined },
    ...platforms.map((platform) => ({
      value: platform.id, name: platform.name, slug: platform.slug,
    })),
  ].map((item) => ({
    value: item.value,
    label: (
      <span className="flex min-w-0 items-center gap-2">
        {createElement(getPlatformIcon(item.slug), {
          'aria-hidden': true,
          className: 'size-4 shrink-0',
        })}
        <span className="truncate">{item.name}</span>
      </span>
    ),
  }))

  return (
    <Select.Root
      name={name}
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue ?? '')}
    >
      <Select.Trigger
        id={id}
        ref={ref}
        onBlur={onBlur}
        aria-invalid={invalid}
        className="flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
      >
        <Select.Value className="min-w-0" />
        <Select.Icon><ChevronDown aria-hidden="true" className="size-4" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-60">
          <Select.Popup className="max-h-(--available-height) w-(--anchor-width) overflow-y-auto rounded-lg border border-input bg-popover p-1 text-popover-foreground shadow-md">
            <Select.List>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator><Check aria-hidden="true" className="size-4" /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
