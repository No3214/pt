import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { nutrients, mealCategories, mealSuggestions } from '../../lib/nutrition'
import { useTranslation } from '../../locales'

interface MealEntry {
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fats: number
  time: string
  notes: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  breakfast: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: '🌅' },
  lunch: { bg: 'bg-green-500/10', text: 'text-green-600', icon: '🍽️' },
  dinner: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: '🌙' },
  snack: { bg: 'bg-pink-500/10', text: 'text-pink-600', icon: '🥜' },
}

export default function FoodTracker() {
  const { darkMode: dm, showToast } = useStore()
  const { t } = useTranslation()
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [newMeal, setNewMeal] = useState<MealEntry>({
    name: '',
    category: 'breakfast',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    notes: '',
  })
  const mealPreviewRef = useRef<HTMLDivElement>(null)
  const mealInView = useInView(mealPreviewRef, { once: true })  const [analyzing, setAnalyzing] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const handleAddMeal = (meal: MealEntry) => {
    setMeals([...meals, meal])
    setNewMeal({ ...newMeal, name: '', calories: 0, protein: 0, carbs: 0, fats: 0, notes: '' })
  }

  const totalStats = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 })

  const mealsByCategory = Object.groupBy ? Object.groupBy(meals, m => m.category) : meals.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {} as Record<string, MealEntry[]>)

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{t.portal.admin.food_title}</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.food_subtitle}</p>
        </div>
        <button
          onClick={() => setShowAddMeal(!showAddMeal)}
          className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showAddMeal ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : (dm ? 'border border-white/10 text-white/70 bg-transparent' : 'border border-stone-200 text-stone-600 bg-transparent')}`}>
          {showAddMeal ? t.portal.admin.food_close : t.portal.admin.food_add_meal}
        </button>
      </motion.div>

      {/* Daily Stats */}
      <motion.div variants={fadeUp} className={`${card} mb-8`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.food_calorie}</p>
            <p className="text-2xl font-bold mt-2">{totalStats.calories}</p>
          </div>
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.food_protein}</p>
            <p className="text-2xl font-bold mt-2">{Math.round(totalStats.protein)}g</p>
          </div>
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.food_carb}</p>
            <p className="text-2xl font-bold mt-2">{Math.round(totalStats.carbs)}g</p>
          </div>
          <div>
            <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.food_fat}</p>
            <p className="text-2xl font-bold mt-2">{Math.round(totalStats.fats)}g</p>
          </div>
        </div>
      </motion.div>

      {/* Add Meal Form */}
      <AnimatePresence>
        {showAddMeal && (
          <motion.div variants={fadeUp} className={`${card} mb-8`}>
            <div className="space-y-4">
              <input
                type="text"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                placeholder={t.portal.admin.food_meal_name}
                className={inp}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                  placeholder={t.portal.admin.food_calorie}
                  className={inp}
                />
                <input
                  type="number"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })}
                  placeholder={t.portal.admin.food_protein}
                  className={inp}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
                  placeholder={t.portal.admin.food_carb}
                  className={inp}
                />
                <input
                  type="number"
                  value={newMeal.fats}
                  onChange={(e) => setNewMeal({ ...newMeal, fats: parseInt(e.target.value) || 0 })}
                  placeholder={t.portal.admin.food_fat}
                  className={inp}
                />
              </div>
              <button
                onClick={() => handleAddMeal(newMeal)}
                className="w-full px-6 py-3 rounded-full bg-primary text-white font-medium cursor-pointer hover:bg-primary/90 transition-all">
                {t.portal.admin.food_save_meal}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meals List */}
      <motion.div ref={mealPreviewRef} variants={fadeUp}>
        {Object.entries(mealsByCategory).map(([category, categoryMeals]) => {
          const colors = categoryColors[category] || categoryColors.snack
          return (
            <div key={category} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{colors.icon}</span>
                <h3 className={`text-sm font-semibold capitalize ${colors.text}`}>{category}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>{categoryMeals.length}</span>
              </div>
              <div className="space-y-2">
                {categoryMeals.map((meal, idx) => (
                  <motion.div key={idx} variants={fadeUp} className={`${card}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{meal.name}</p>
                        <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>{meal.time}</p>
                      </div>
                      <span className="font-semibold text-primary">{meal.calories} kcal</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}