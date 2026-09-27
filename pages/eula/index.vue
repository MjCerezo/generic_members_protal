<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4 sm:p-8">
    <div class="w-full max-w-3xl my-8">
      <!-- Logo Mark -->
      <div class="flex justify-center mb-8">
        <img :src="$config.public.clientLogo" :alt="`${$config.public.clientName} Logo`" class="h-20 w-auto object-contain" />
      </div>
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black text-slate-900 mb-2">Membership Application</h1>
        <p class="text-sm text-slate-500 font-medium">{{ $config.public.clientName }}</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-blue-600 to-indigo-500"></div>

        <div class="p-6 sm:p-10">
          
          <!-- User Responsibility Agreement -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section 1</p>
                <h2 class="text-lg font-black text-slate-900">User Responsibility Agreement</h2>
              </div>
            </div>

            <div class="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed space-y-4 mb-5">
              <p>
                I am responsible for the proper use of this Membership Application and access rights assigned to me. I will not share my access rights with any other party. I acknowledge that any improper use of this Membership Application and/or my access rights caused directly or indirectly by my action will constitute a violation of and will be subject to the policies and procedures of {{ $config.public.clientName }} and may result in indefinite suspension of my access rights and/or cause {{ $config.public.clientName }} to take necessary actions to protect its interest.
              </p>
              <p>
                I affirm that the information I will provide or have provided herein and the supporting documents I will submit or have submitted in connection with my membership, applications and transactions with {{ $config.public.clientName }} are true, complete, accurate, and updated.
              </p>
            </div>
            
            <label class="flex items-start sm:items-center gap-3 cursor-pointer group w-fit">
              <div class="relative flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5 sm:mt-0">
                <input type="checkbox" v-model="agreedResponsibility" class="peer sr-only" />
                <div class="w-6 h-6 border-2 border-slate-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors group-hover:border-blue-500"></div>
                <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm font-bold text-slate-700 group-hover:text-slate-900 select-none">I agree to the User Responsibility Agreement</span>
            </label>
          </div>

          <div class="w-full h-px bg-slate-100 my-8"></div>

          <!-- Data Privacy Waiver -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section 2</p>
                <h2 class="text-lg font-black text-slate-900">Data Privacy Waiver</h2>
              </div>
            </div>

            <div class="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed space-y-4 mb-5">
              <p>
                By accessing this Membership Application, I agree that {{ $config.public.clientName }} may process, obtain, collect, record, organize, store, update, modify, use, access, share and/or disclose information relating to me, including personal information and personal data, to approve, manage, update, facilitate, administer and implement my membership in and transactions with {{ $config.public.clientName }}. I authorize {{ $config.public.clientName }} and my Company's HR to disclose to, receive from and/or share my information with each other for purposes of validating, verifying and/or updating my membership information and facilitate processing of my transactions with {{ $config.public.clientName }}. I have been informed and duly accept {{ $config.public.clientName }}'s Data Privacy Policy as published in {{ $config.public.clientName }}'s website <a :href="`https://${$config.public.clientWebsite}`" target="_blank" class="text-blue-600 font-bold hover:underline">{{ $config.public.clientWebsite }}</a>.
              </p>
            </div>

            <label class="flex items-start sm:items-center gap-3 cursor-pointer group w-fit">
              <div class="relative flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5 sm:mt-0">
                <input type="checkbox" v-model="agreedPrivacy" class="peer sr-only" />
                <div class="w-6 h-6 border-2 border-slate-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors group-hover:border-blue-500"></div>
                <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm font-bold text-slate-700 group-hover:text-slate-900 select-none">I agree to the Data Privacy Waiver</span>
            </label>
          </div>

          <button
            @click="acceptTerms"
            :disabled="!canProceed"
            :class="[
              'w-full px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3',
              canProceed 
                ? 'bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 cursor-pointer' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            ]"
          >
            <svg v-if="canProceed" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span>Proceed to Application</span>
          </button>
        </div>

        <div class="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">{{ $config.public.clientName }} Data Privacy Office</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const agreedResponsibility = ref(false)
const agreedPrivacy = ref(false)

const canProceed = computed(() => agreedResponsibility.value && agreedPrivacy.value)

const acceptTerms = () => {
  if (canProceed.value) {
    router.push('/member-application/qde')
  }
}
</script>
