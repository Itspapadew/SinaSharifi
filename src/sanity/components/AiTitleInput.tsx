import { useCallback, useState } from 'react'
import { TextInput, Button, Stack, Inline } from '@sanity/ui'
import { set, unset, useFormValue } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export function AiTitleInput(props: any) {
  const { value, onChange, elementProps } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const image = useFormValue(['image']) as any

  const generate = useCallback(async () => {
    if (!image?.asset?._ref) {
      setError('Upload an image first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const projectId = 'x99xbcur'
      const dataset = 'production'
      const ref = image.asset._ref
      const clean = ref.replace('image-', '').replace(/-(\w+)$/, '.$1')
      const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${clean}`

      const res = await fetch('https://sharifisina.com/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.title) onChange(set(data.title))
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
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
          disabled={loading}
          onClick={generate}
        />
      </Inline>
      {error && <p style={{ color: 'red', fontSize: '12px', margin: 0 }}>{error}</p>}
    </Stack>
  )
}
