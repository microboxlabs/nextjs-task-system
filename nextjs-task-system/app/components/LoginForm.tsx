'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Label, TextInput, Alert, Card } from 'flowbite-react'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      // Here you would typically make an API call to your authentication endpoint
      // For demonstration, we'll just log the credentials and simulate a successful login
      console.log('Login attempt with:', { email, password })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // If login is successful, redirect to dashboard (or any other page)
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <Card>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="name@flowbite.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <Alert color="failure">
            {error}
          </Alert>
        )}
        <Button type="submit">
          Login
        </Button>
      </form>
    </Card>
  )
}

