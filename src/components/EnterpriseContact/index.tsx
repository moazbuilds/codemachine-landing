/**
 * EnterpriseContact Component
 * Teams & Enterprise section with contact form
 *
 * Features:
 * - Contact form for enterprise inquiries
 * - Glass-morphic design matching site aesthetic
 * - Form validation
 * - Responsive layout
 */

import { useState } from 'react'

export function EnterpriseContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send email using Web3Forms (free, no signup required)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'd392e1dc-ea91-41b3-a957-e40067fa6aa8',
          name: formData.name,
          email: formData.email,
          subject: `Enterprise Inquiry from ${formData.company}`,
          message: `Company: ${formData.company}\nFrom: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`,
          from_name: formData.name
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', company: '', message: '' })
        setTimeout(() => setSubmitStatus('idle'), 3000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 3000)
      }
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section
      id="enterprise"
      className="relative mx-auto max-w-6xl px-6 py-20"
      aria-label="Teams & Enterprise Contact"
    >
      <div className="flex flex-col items-center gap-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Business Inquiries
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl">
            Need custom templates, specialized workflows, or integrations tailored to your specific use case? Let's discuss how we can build a solution that fits your exact requirements.
          </p>
        </div>

        {/* Contact Form - Simple & Elegant */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                placeholder="Your Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                placeholder="Email Address"
              />
            </div>

            {/* Company Field */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
              placeholder="Company Name"
            />

            {/* Message Field */}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none text-sm"
              placeholder="Tell us about your project..."
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-400/60 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                'Sending...'
              ) : submitStatus === 'success' ? (
                '✓ Message Sent!'
              ) : submitStatus === 'error' ? (
                '✕ Failed to send. Try again.'
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
