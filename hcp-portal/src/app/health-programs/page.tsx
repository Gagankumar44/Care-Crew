'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Sparkles, Target, Play, CheckCircle, Clock, TrendingUp, Brain, Activity, Heart, Dumbbell } from 'lucide-react'
import { mockHealthPrograms } from '@/data/mockData'
import type { HealthProgram } from '@/data/mockData'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | 'chronic-care' | 'fitness' | 'rehab' | 'mental-wellness'

export default function HealthProgramsPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [programs] = useState<HealthProgram[]>(mockHealthPrograms)

  const filteredPrograms = filter === 'all' 
    ? programs 
    : programs.filter(p => p.category === filter)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chronic-care':
        return Heart
      case 'fitness':
        return Activity
      case 'rehab':
        return Dumbbell
      case 'mental-wellness':
        return Brain
      default:
        return Target
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'chronic-care':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      case 'fitness':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      case 'rehab':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'mental-wellness':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
    }
  }

  const handleEnroll = (programId: string) => {
    alert(`Enrolling in program ${programId}...`)
  }

  const handleStartModule = (programId: string, moduleId: string) => {
    alert(`Starting module ${moduleId} in program ${programId}...`)
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Health Programs
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Personalized guided programs with AI coaching and AR exercises
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all' as FilterType, label: 'All Programs' },
            { id: 'chronic-care' as FilterType, label: 'Chronic Care' },
            { id: 'fitness' as FilterType, label: 'Fitness' },
            { id: 'rehab' as FilterType, label: 'Rehabilitation' },
            { id: 'mental-wellness' as FilterType, label: 'Mental Wellness' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-primary text-white'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 hover:bg-white/70 dark:hover:bg-neutral-800/70'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrograms.map((program, index) => {
            const CategoryIcon = getCategoryIcon(program.category)
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                {/* Program Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getCategoryColor(program.category)}`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {program.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(program.category)}`}>
                          {program.category.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {program.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  {program.status === 'available' && (
                    <Button
                      onClick={() => handleEnroll(program.id)}
                      size="sm"
                    >
                      Enroll
                    </Button>
                  )}
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {program.description}
                </p>

                {/* Progress Bar */}
                {program.enrolled && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Progress
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {program.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${program.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  {program.aiCoachEnabled && (
                    <div className="flex items-center gap-1 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Coach</span>
                    </div>
                  )}
                  {program.arExercisesEnabled && (
                    <div className="flex items-center gap-1 text-primary">
                      <Target className="w-4 h-4" />
                      <span>AR Exercises</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration}</span>
                  </div>
                </div>

                {/* Modules */}
                {program.enrolled && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Program Modules
                    </h4>
                    {program.modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-neutral-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {module.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                              <span className="capitalize">{module.type}</span>
                              <span>•</span>
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                        {!module.completed && (
                          <Button
                            onClick={() => handleStartModule(program.id, module.id)}
                            size="sm"
                            variant="outline"
                          >
                            Start
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Status Badge */}
                {program.status === 'active' && (
                  <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Program Active
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredPrograms.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Target className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Programs Found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Try a different filter or check back later for new programs
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

