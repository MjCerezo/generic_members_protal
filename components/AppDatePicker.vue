<template>
  <div class="relative flex items-center w-full group">
    <!-- The visible formatted text input -->
    <input
      type="text"
      :value="formattedValue"
      @input="handleTextInput"
      @blur="formatOnBlur"
      class="premium-input px-3 w-full pr-10"
      :class="[
        error ? 'border-rose-500 bg-rose-50 text-rose-900 focus:ring-rose-200' : '',
        disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed opacity-80' : ''
      ]"
      placeholder="mm/dd/yyyy"
      maxlength="10"
      :disabled="disabled"
    />
    
    <!-- Hidden native date picker triggered programmatically -->
    <input 
      type="date" 
      ref="nativePicker"
      :value="modelValue"
      @input="handleDateSelect"
      :min="min"
      :max="max"
      class="sr-only opacity-0 absolute pointer-events-none"
      :disabled="disabled"
    />
    
    <!-- Visible Calendar Icon (Clickable) -->
    <div 
      class="absolute inset-y-0 right-0 w-10 flex items-center justify-center text-slate-500 transition-colors z-10" 
      :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-blue-900'"
      @click="!disabled && openPicker()"
    >
      <svg class="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | null
  min?: string
  max?: string
  error?: boolean
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const formattedValue = ref('')
const nativePicker = ref<HTMLInputElement | null>(null)

// Initialize formatted value from modelValue (YYYY-MM-DD -> MM/DD/YYYY)
watch(() => props.modelValue, (newVal) => {
  if (newVal && typeof newVal === 'string' && newVal.length === 10) {
    const parts = newVal.split('-')
    if (parts.length === 3) {
      formattedValue.value = `${parts[1]}/${parts[2]}/${parts[0]}`
    }
  } else if (!newVal) {
    formattedValue.value = ''
  }
}, { immediate: true })

// Handle typing in the text field (auto-format as MM/DD/YYYY)
const handleTextInput = (e: Event) => {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  
  if (val.length >= 1 && parseInt(val[0], 10) > 1) val = '0' + val
  if (val.length >= 2) {
    const m = parseInt(val.substring(0, 2), 10)
    if (m === 0) val = '01' + val.substring(2)
    if (m > 12) val = '12' + val.substring(2)
  }
  
  if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2)
  
  if (val.length >= 4) {
    const d1 = parseInt(val[3], 10)
    if (d1 > 3) val = val.substring(0, 3) + '0' + val.substring(3)
  }
  if (val.length >= 5) {
    const d = parseInt(val.substring(3, 5), 10)
    if (d === 0) val = val.substring(0, 3) + '01' + val.substring(5)
    if (d > 31) val = val.substring(0, 3) + '31' + val.substring(5)
  }
  
  if (val.length > 5) val = val.substring(0, 5) + '/' + val.substring(5)
  
  formattedValue.value = val.substring(0, 10)

  if (formattedValue.value.length === 10) {
    const parts = formattedValue.value.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      
      const d = new Date(year, month - 1, day)
      const isValid = d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day
      
      if (isValid && year >= 1900 && year <= 2100) {
        emit('update:modelValue', `${parts[2]}-${parts[0]}-${parts[1]}`)
      } else {
        emit('update:modelValue', '')
      }
    }
  } else if (formattedValue.value === '') {
    emit('update:modelValue', '')
  }
}

const formatOnBlur = () => {
  if (formattedValue.value.length === 10) {
    const parts = formattedValue.value.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      
      const d = new Date(year, month - 1, day)
      const isValid = d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day
      
      if (isValid && year >= 1900 && year <= 2100) {
        emit('update:modelValue', `${parts[2]}-${parts[0]}-${parts[1]}`)
        return
      }
    }
  }
  // If invalid or empty, clear it
  if (formattedValue.value !== '') {
    formattedValue.value = ''
    emit('update:modelValue', '')
  }
}

// Handle native date picker selection
const handleDateSelect = (e: Event) => {
  const val = (e.target as HTMLInputElement).value // Format: YYYY-MM-DD
  emit('update:modelValue', val)
}

// Open native date picker programmatically
const openPicker = () => {
  if (nativePicker.value) {
    try {
      if (typeof nativePicker.value.showPicker === 'function') {
        nativePicker.value.showPicker()
      } else {
        nativePicker.value.focus()
        nativePicker.value.click()
      }
    } catch(e) {
      console.warn("Could not open native picker", e)
    }
  }
}
</script>
