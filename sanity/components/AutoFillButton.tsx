import { useState } from 'react'
import { useFormValue, set, setIfMissing } from 'sanity'
import { Button, Card, Stack, Text, Spinner } from '@sanity/ui'

export function AutoFillButton({ onChange }: { onChange: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const image = useFormValue(['image']) as any

  const autoFill = async () => {
    if (!image?.asset?._ref) {
      setMessage('Please upload an image first')
      return
    }

    setLoading(true)
    setMessage('Analysing your photo...')

    try {
      const response = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageRef: image.asset._ref }),
      })

      const data = await response.json()

      if (data.error) {
        setMessage('Error: ' + data.error)
        return
      }

      onChange([
        set(data.title, ['title']),
        set(data.category, ['category']),
        set(data.location, ['location']),
      ])

      setMessage('Done! Review and adjust the suggestions.')
    } catch (err) {
      setMessage('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card padding={3} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Button
          onClick={autoFill}
          disabled={loading}
          tone="primary"
          text={loading ? 'Analysing...' : '✨ Auto-fill with AI'}
          icon={loading ? Spinner : undefined}
        />
        {message && (
          <Text size={1} muted>{message}</Text>
        )}
      </Stack>
    </Card>
  )
}
