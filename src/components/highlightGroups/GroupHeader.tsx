import { useDebouncedCallback } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function GroupHeader({
  name,
  onNameChange,
  onRemove,
}: {
  name: string
  onNameChange: (newName: string) => void
  onRemove: () => void
}) {
  const [draftName, setDraftName] = useState(name)
  const debouncedOnNameChange = useDebouncedCallback(onNameChange, 250)

  useEffect(() => {
    setDraftName(name)
  }, [name])

  return (
    <div className="mb-3 flex items-start gap-3">
      <Input
        aria-label="Group name"
        className="h-8 text-sm"
        placeholder="Enter a name"
        value={draftName}
        onChange={(event) => {
          setDraftName(event.currentTarget.value)
          debouncedOnNameChange(event.currentTarget.value)
        }}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Remove ${name}`}
        onClick={onRemove}
      >
        <Trash2Icon />
      </Button>
    </div>
  )
}
