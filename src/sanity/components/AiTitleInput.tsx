import { useCallback, useState } from 'react'
import { TextInput, Button, Stack, Inline } from '@sanity/ui'
import { set, unset, useFormValue } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export function AiTitleInput(props: any) {
  const { value, onChange, elementProps } = props
  const [loading, setLoading] = useState(false)
  const image = useFormValue(['image']) as any

  const generate = useCallback(async () => {
    if (!image?.asset?._ref) return
    setLoading(true)
    try {
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
      const ref = image.asset._ref
      const clean = ref.replace('image-', '').replace(/-(\w+)$/, '.$1')
      const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${clean}`

      const res = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      })
      const data = await res.json()
      if (data.title) {
        onChange(data.title ? set(data.title) : unset())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [image, onChange])

  return (
    <Stack space={2}>
      <Inline space={2}>
        <div style={{ flex: 1 }}>
          <TextInput
            {...elementProps}
            value={value || ''}
            onChange={e => onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())}
          />
        </div>
        <Button
          icon={SparklesIcon}
          text={loading ? 'Generating...' : 'AI Title'}
          tone="primary"
          mode="ghost"
          loading={loading}
          disabled={loading || !image?.asset?._ref}
          onClick={generate}
        />
      </Inline>
    </Stack>
  )
}
