import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useShareStore } from '@/store/useShareStore'
import toast from 'react-hot-toast'
import s from './PaymentPage.module.css'

const PLANS = {
  pro: {
    name:  'Pro',
    price: '¥1,490',
    color: '#7c6cfa',
    features: [
      'Unlimited AI generations',
      'PDF · Excel · Screenshot export',
      'Unlimited team sharing',
      'No cooldown or daily limits',
      'Share history & analytics',
      'Priority AI queue',
      'Email delivery of shares',
    ],
  },
  team: {
    name:  'Team',
    price: '¥3,980',
    color: '#22d3ee',
    features: [
      'Everything in Pro',
      'Up to 10 workspace members',
      'Shared project workspace',
      'Full Jira & CI/CD integration',
      'Admin dashboard access',
      'Priority support',
      'SSO / SAML login',
    ],
  },
}

export default function PaymentPage() {
  const navigate        = useNavigate()
  const [params]        = useSearchParams()
  const planId          = params.get('plan') || 'pro'
  const plan            = PLANS[planId] || PLANS.pro
  const { upgrade }     = useShareStore()

  const [cardNum, setCardNum] = useState('')
  const [expiry,  setExpiry]  = useState('')
  const [cvc,     setCvc]     = useState('')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  function formatCard(v) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(v) {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  async function handlePay(e) {
    e.preventDefault()
    if (!cardNum || !expiry || !cvc || !name || !email) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    // Simulate 2-second payment processing
    await new Promise(r => setTimeout(r, 2000))
    upgrade(planId)
    setLoading(false)
    setDone(true)
    setTimeout(() => {
      toast.success(`${plan.name} plan activated! 🎉`)
      navigate('/subscription')
    }, 2200)
  }

  if (done) {
    return (
      <div className={s.successPage}>
        <div className={s.successIcon}></div>
        <h1 className={s.successTitle}>Payment successful!</h1>
        <p className={s.successSub}>{plan.name} plan activated. Redirecting…</p>
      </div>
    )
  }

  return (
    <div className={s.page}>
      <div className={s.container}>

        {/* Left — order summary */}
        <div className={s.summary}>
          <button className={s.backBtn} onClick={() => navigate('/subscription')}>
            ← Back to plans
          </button>

          <div className={s.summaryCard}>
            <div className={s.summaryHeader}>
              <div className={s.planIcon} style={{ background: plan.color }}>💎</div>
              <div>
                <h2 className={s.planName}>{plan.name} Plan</h2>
                <p className={s.planSub}>Billed monthly · cancel anytime</p>
              </div>
            </div>

            <div className={s.priceRow}>
              <span className={s.priceBig}>{plan.price}</span>
              <span className={s.pricePer}>/month</span>
            </div>

            <div className={s.divider} />

            <ul className={s.featureList}>
              {plan.features.map(f => (
                <li key={f} className={s.featureItem}>
                  <span className={s.checkIcon}></span>
                  {f}
                </li>
              ))}
            </ul>

            <div className={s.divider} />

            <div className={s.totalRow}>
              <span>Total today</span>
              <span className={s.totalAmt}>{plan.price}</span>
            </div>

            <p className={s.cancelNote}>Cancel anytime. No hidden fees.</p>
          </div>

          <div className={s.secureNote}>
            <span>🔒</span>
            <span>
              This is a portfolio demo — no real payment occurs.
              Use any card details to test the flow.
            </span>
          </div>
        </div>

        {/* Right — payment form */}
        <div className={s.formSection}>
          <h1 className={s.formTitle}>Complete your order</h1>
          <p className={s.formSub}>Demo mode — enter any card details</p>

          <form onSubmit={handlePay} className={s.form}>

            <div className={s.fieldGroup}>
              <label className={s.label}>Email address</label>
              <input
                className={s.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={s.fieldGroup}>
              <label className={s.label}>Cardholder name</label>
              <input
                className={s.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name on card"
                required
              />
            </div>

            <div className={s.fieldGroup}>
              <label className={s.label}>Card number</label>
              <div className={s.cardInputWrap}>
                <span className={s.cardIcon}>💳</span>
                <input
                  className={`${s.input} ${s.cardInput}`}
                  value={cardNum}
                  onChange={e => setCardNum(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className={s.row2}>
              <div className={s.fieldGroup}>
                <label className={s.label}>Expiry date</label>
                <input
                  className={s.input}
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>CVC</label>
                <input
                  className={s.input}
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <button
              className={s.payBtn}
              type="submit"
              disabled={loading}
              style={{ background: plan.color }}
            >
              {loading
                ? <><span className={s.spinner} /> Processing payment…</>
                : <>Pay {plan.price} / month</>
              }
            </button>

            <div className={s.cardBrands}>
              <span>VISA</span>
              <span>Mastercard</span>
              <span>AMEX</span>
              <span>JCB</span>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
