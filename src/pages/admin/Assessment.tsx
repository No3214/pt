import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useTranslation } from '../../locales'

interface Assessment {
  id: string
  clientId: string
  date: string
  weight: number
  bodyFat: number
  measurements: { chest: number; waist: number; hip: number; arm: number; leg: number }
  performance: { benchPress: number; deadlift: number; squat: number }
  notes: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

export default function Assessment() {
  const { clients, darkMode: dm, showToast } = useStore()
  const { t } = useTranslation()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newAssessment, setNewAssessment] = useState<Omit<Assessment, 'id'>>({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    bodyFat: 0,
    measurements: { chest: 0, waist: 0, hip: 0, arm: 0, leg: 0 },
    performance: { benchPress: 0, deadlift: 0, squat: 0 },
    notes: '',
  })
  const assessmentRef = useRef<HTMLDivElement>(null)
  const assessmentInView = useInView(assessmentRef, { once: true })

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
  const stagger = { show: { transition: { staggerChildren: 0.07 } } }

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || !newAssessment.date) {
      showToast(t.portal.admin.assessment_select_client)
      return
    }
    const assessment: Assessment = {
      id: Date.now().toString(),
      ...newAssessment,
      clientId: selectedClient,
    }
    setAssessments([...assessments, assessment])
    setNewAssessment({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      bodyFat: 0,
      measurements: { chest: 0, waist: 0, hip: 0, arm: 0, leg: 0 },
      performance: { benchPress: 0, deadlift: 0, squat: 0 },
      notes: '',
    })
    setShowForm(false)
  }

  const clientAssessments = selectedClient ? assessments.filter(a => a.clientId === selectedClient) : []
  const latestAssessment = clientAssessments.length > 0 ? clientAssessments[clientAssessments.length - 1] : null

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{t.portal.admin.assessment_title}</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.assessment_subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showForm ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : (dm ? 'border border-white/10 text-white/70 bg-transparent' : 'border border-stone-200 text-stone-600 bg-transparent')}`}>
          {showForm ? t.portal.admin.assessment_close : t.portal.admin.assessment_add}
        </button>
      </motion.div>

      {/* Client Selector */}
      <motion.div variants={fadeUp} className="mb-8">
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className={inp}>
          <option value="">{t.portal.admin.assessment_select_client}</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </motion.div>

      {/* Assessment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div variants={fadeUp} className={`${card} mb-8`}>
            <form onSubmit={handleAddAssessment} className="space-y-6">
              {/* Body Metrics */}
              <div>
                <h3 className="font-semibold mb-4 text-sm">{t.portal.admin.assessment_body_metrics}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <input
                    type="date"
                    value={newAssessment.date}
                    onChange={(e) => setNewAssessment({ ...newAssessment, date: e.target.value })}
                    className={inp}
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={newAssessment.weight || ''}
                    onChange={(e) => setNewAssessment({ ...newAssessment, weight: parseFloat(e.target.value) || 0 })}
                    placeholder={t.portal.admin.assessment_weight}
                    className={inp}
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={newAssessment.bodyFat || ''}
                    onChange={(e) => setNewAssessment({ ...newAssessment, bodyFat: parseFloat(e.target.value) || 0 })}
                    placeholder={t.portal.admin.assessment_body_fat}
                    className={inp}
                  />
                </div>
              </div>

              {/* Measurements */}
              <div>
                <h3 className="font-semibold mb-4 text-sm">{t.portal.admin.assessment_measurements}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(newAssessment.measurements).map(([key, val]) => (
                    <input
                      key={key}
                      type="number"
                      step="0.5"
                      value={val || ''}
                      onChange={(e) => setNewAssessment({
                        ...newAssessment,
                        measurements: { ...newAssessment.measurements, [key]: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      className={inp}
                    />
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div>
                <h3 className="font-semibold mb-4 text-sm">{t.portal.admin.assessment_performance}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(newAssessment.performance).map(([key, val]) => (
                    <input
                      key={key}
                      type="number"
                      step="2.5"
                      value={val || ''}
                      onChange={(e) => setNewAssessment({
                        ...newAssessment,
                        performance: { ...newAssessment.performance, [key]: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      className={inp}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <textarea
                value={newAssessment.notes}
                onChange={(e) => setNewAssessment({ ...newAssessment, notes: e.target.value })}
                placeholder={t.portal.admin.assessment_notes}
                className={`${inp} h-20 resize-none`}
              />

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full bg-primary text-white font-medium cursor-pointer hover:bg-primary/90 transition-all">
                {t.portal.admin.assessment_save}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latest Assessment */}
      {latestAssessment && (
        <motion.div variants={fadeUp} className={card}>
          <div className="mb-6 pb-4 border-b" style={{borderColor: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}}>
            <h3 className="font-semibold text-lg">{t.portal.admin.assessment_latest}</h3>
            <p className={`text-xs mt-1 ${dm ? 'text-white/40' : 'text-stone-400'}`}>{new Date(latestAssessment.date).toLocaleDateString()}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Body Stats */}
            <div>
              <h4 className={`text-xs font-semibold uppercase mb-4 ${dm ? 'text-white/50' : 'text-stone-400'}`}>{t.portal.admin.assessment_body_metrics}</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-sm ${dm ? 'text-white/60' : 'text-stone-600'}`}>{t.portal.admin.assessment_weight}</span>
                  <span className="font-semibold">{latestAssessment.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dm ? 'text-white/60' : 'text-stone-600'}`}>{t.portal.admin.assessment_body_fat}</span>
                  <span className="font-semibold">{latestAssessment.bodyFat}%</span>
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div>
              <h4 className={`text-xs font-semibold uppercase mb-4 ${dm ? 'text-white/50' : 'text-stone-400'}`}>{t.portal.admin.assessment_measurements}</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(latestAssessment.measurements).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className={dm ? 'text-white/60' : 'text-stone-600'}>{key}</span>
                    <span className="font-medium">{val} cm</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className={`mt-6 pt-6 border-t space-y-2 text-sm`} style={{borderColor: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}}>
            <h4 className={`text-xs font-semibold uppercase mb-3 ${dm ? 'text-white/50' : 'text-stone-400'}`}>{t.portal.admin.assessment_performance}</h4>
            {Object.entries(latestAssessment.performance).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className={dm ? 'text-white/60' : 'text-stone-600'}>{key}</span>
                <span className="font-medium">{val} kg</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {latestAssessment.notes && (
            <div className={`mt-6 pt-6 border-t`} style={{borderColor: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}}>
              <p className={`text-xs font-semibold uppercase mb-2 ${dm ? 'text-white/50' : 'text-stone-400'}`}>{t.portal.admin.assessment_notes}</p>
              <p className={`text-sm ${dm ? 'text-white/70' : 'text-stone-700'}`}>{latestAssessment.notes}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Assessment History */}
      {clientAssessments.length > 1 && (
        <motion.div variants={fadeUp} className={`${card} mt-8`}>
          <h3 className="font-semibold mb-4">{t.portal.admin.assessment_history}</h3>
          <div className="space-y-3">
            {clientAssessments.map((a, idx) => (
              <motion.div key={a.id} variants={fadeUp} className={`p-4 rounded-lg border ${dm ? 'border-white/5' : 'border-stone-100'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{new Date(a.date).toLocaleDateString()}</p>
                    <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>{a.weight} kg · {a.bodyFat}% BF</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}