<template>
  <div>
    <!-- Loading -->
    <div v-if="loadingProfile" class="loading-state">
      <div class="spinner" />
      <p>Loading your profile…</p>
    </div>

    <!-- ─── PROFILE PAGE (with internal sub-navigation) ─── -->
    <section v-else class="page profile-page">

        <!-- ── Profile Tab Bar ── -->
        <div class="profile-tab-bar">
          <button
            v-if="config.public.subPersonalProfile"
            class="profile-tab"
            :class="{ 'profile-tab--active': profileSubPage === 'personal-profile' }"
            @click="profileSubPage = 'personal-profile'"
          >
            <svg class="profile-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span>Personal Profile</span>
          </button>
          <button
            v-if="config.public.subFinancialProfile"
            class="profile-tab"
            :class="{ 'profile-tab--active': profileSubPage === 'financial-profile' }"
            @click="switchProfileSub('financial-profile')"
          >
            <svg class="profile-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Financial Profile</span>
          </button>
          <button
            v-if="config.public.subFinancialInfo"
            class="profile-tab"
            :class="{ 'profile-tab--active': profileSubPage === 'financial-info' }"
            @click="switchProfileSub('financial-info')"
          >
            <svg class="profile-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>Financial Information</span>
          </button>
        </div>

        <!-- ── Sub-Page Content ── -->
        <div class="profile-content sub-anim" :key="profileSubPage">

          <!-- Personal Profile -->
          <div v-if="profileSubPage === 'personal-profile'">

            <!-- Member identity hero -->
            <div class="member-hero">
              <div class="member-hero-avatar">{{ memberInitials }}</div>
              <div class="member-hero-info">
                <h2 class="member-hero-name">{{ memberFullName }}</h2>
                <div class="member-hero-meta">
                  <span class="member-hero-badge">{{ memberTypeDesc || 'Member' }}</span>
                  <span class="member-hero-sep">·</span>
                  <span class="member-hero-id">Member ID: {{ memberMemberId || '—' }}</span>
                  <span class="member-hero-sep">·</span>
                  <span class="member-hero-since">Member since {{ memberSince ? formatDisplayDate(memberSince) : '—' }}</span>
                </div>
              </div>
            </div>

            <!-- ── Personal Details card ── -->
            <div class="info-section-card">

              <!-- Personal Details -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Personal Details</span>
              </div>
              <div class="info-grid">
                <div class="info-cell">
                  <span class="info-cell-label">Full Name</span>
                  <span class="info-cell-value">{{ memberFullName }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Gender</span>
                  <span class="info-cell-value">{{ memberGender === 'M' ? 'Male' : memberGender === 'F' ? 'Female' : '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Birth Date</span>
                  <span class="info-cell-value">{{ memberBirthDate ? formatDisplayDate(memberBirthDate) : '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Place of Birth</span>
                  <span class="info-cell-value">{{ memberPlaceOfBirth || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Civil Status</span>
                  <span class="info-cell-value">{{ lookups.civilStatus.find(c => c.codeValue === memberCivilStatus)?.desc1 || memberCivilStatus || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Religion</span>
                  <span class="info-cell-value">{{ lookups.religion.find(r => r.codeValue === memberReligion)?.desc1 || memberReligion || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">TIN</span>
                  <span class="info-cell-value">{{ memberTin || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">SSS Number</span>
                  <span class="info-cell-value">{{ memberSss || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Education</span>
                  <span class="info-cell-value">{{ lookups.educAttainment.find(e => e.codeValue === memberEducAttainment)?.desc1 || memberEducAttainment || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">No. of Dependents</span>
                  <span class="info-cell-value">{{ memberNoOfDependents !== '' ? memberNoOfDependents : '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Nationality</span>
                  <span class="info-cell-value">{{ lookups.nationalities.find(n => n.code === memberNationality)?.description || memberNationality || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Birth Country</span>
                  <span class="info-cell-value">{{ lookups.countries.find(c => c.code === memberCountryOfBirth)?.description || memberCountryOfBirth || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Mobile Number</span>
                  <span class="info-cell-value">{{ memberMobile || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Personal Email Address</span>
                  <span class="info-cell-value" style="word-break: break-all;">{{ memberEmail || '—' }}</span>
                </div>
              </div>

              <div class="info-divider"></div>

              <!-- Present Address -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Present Address</span>
              </div>
              <div class="info-address-block">
                {{ [memberPresentAddress.roomNo, memberPresentAddress.houseNo, memberPresentAddress.street, memberPresentAddress.barangay, memberPresentAddress.city, memberPresentAddress.province, memberPresentAddress.postalCode].filter(Boolean).join(', ') || '—' }}
              </div>

              <div class="info-divider"></div>

              <!-- Permanent Address -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Permanent Address</span>
              </div>
              <div class="info-address-block">
                <span v-if="memberSameAddress">Same as Present Address</span>
                <span v-else>{{ [memberPermAddress.roomNo, memberPermAddress.houseNo, memberPermAddress.street, memberPermAddress.barangay, memberPermAddress.city, memberPermAddress.province, memberPermAddress.postalCode].filter(Boolean).join(', ') || '—' }}</span>
              </div>

              <div class="info-divider"></div>

              <!-- Emergency Contacts -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Emergency Contacts</span>
              </div>
              <div v-if="memberEmergencyContacts.length === 0" class="info-empty">No emergency contact on record.</div>
              <div v-else class="info-list">
                <div v-for="(ec, i) in memberEmergencyContacts" :key="i" class="info-list-item" :class="{ 'info-list-item--bordered': i < memberEmergencyContacts.length - 1 }">
                  <div class="info-grid">
                    <div class="info-cell">
                      <span class="info-cell-label">Name</span>
                      <span class="info-cell-value">{{ ec.fullName }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Relationship</span>
                      <span class="info-cell-value">{{ lookups.relationships.find(r => r.codeValue === ec.relationship)?.desc1 || ec.relationship || '—' }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Birth Date</span>
                      <span class="info-cell-value">{{ ec.dateOfBirth ? formatDisplayDate(ec.dateOfBirth) : '—' }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Contact Number</span>
                      <span class="info-cell-value">{{ ec.contactNumber || '—' }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Address</span>
                      <span class="info-cell-value">{{ ec.address || '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-divider"></div>

              <!-- Employment Details -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Employment Details</span>
              </div>
              <div class="info-grid">
                <div class="info-cell">
                  <span class="info-cell-label">Employer</span>
                  <span class="info-cell-value">{{ memberEmployer || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Company Code</span>
                  <span class="info-cell-value">{{ memberCompanyCode || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Branch</span>
                  <span class="info-cell-value">{{ memberBranch || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Position Category</span>
                  <span class="info-cell-value">{{ lookups.positionCategories.find(p => p.codeValue === memberPositionCategory)?.desc1 || memberPositionCategory || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Position</span>
                  <span class="info-cell-value">{{ memberPosition || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Employee ID</span>
                  <span class="info-cell-value">{{ memberEmployeeId || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Date Hired</span>
                  <span class="info-cell-value">{{ memberDateHired ? formatDisplayDate(memberDateHired) : '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Employment Type</span>
                  <span class="info-cell-value">{{ lookups.employmentTypes.find(e => e.code === memberEmploymentType)?.desc || memberEmploymentType || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Employment Status</span>
                  <span class="info-cell-value">{{ lookups.employmentStatuses.find(e => e.code === memberEmploymentStatus)?.desc || memberEmploymentStatus || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Annual Income</span>
                  <span class="info-cell-value">{{ lookups.annualIncome.find(a => a.codeValue === memberAnnualIncome)?.desc1 || memberAnnualIncome || '—' }}</span>
                </div>
              </div>

              <div class="info-divider"></div>

              <!-- Beneficiaries -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Beneficiaries / Dependents</span>
              </div>
              <div v-if="memberBeneficiaries.length === 0" class="info-empty">No beneficiary on record.</div>
              <div v-else class="info-list">
                <div v-for="(b, i) in memberBeneficiaries" :key="i" class="info-list-item" :class="{ 'info-list-item--bordered': i < memberBeneficiaries.length - 1 }">
                  <div class="info-grid">
                    <div class="info-cell">
                      <span class="info-cell-label">Name</span>
                      <span class="info-cell-value">{{ b.firstName }} {{ b.lastName }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Relationship</span>
                      <span class="info-cell-value">{{ lookups.relationships.find(r => r.codeValue === b.relationship)?.desc1 || b.relationship || '—' }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Birth Date</span>
                      <span class="info-cell-value">{{ b.dateOfBirth ? formatDisplayDate(b.dateOfBirth) : '—' }}</span>
                    </div>
                    <div class="info-cell">
                      <span class="info-cell-label">Mobile</span>
                      <span class="info-cell-value">{{ b.mobileNo || '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-divider"></div>

              <!-- Financial Details -->
              <div class="info-section-header">
                <div class="info-section-dot bg-blue-900"></div>
                <span class="info-section-title">Financial Details</span>
              </div>
              <div class="info-grid">
                <div class="info-cell">
                  <span class="info-cell-label">Capital Pledge</span>
                  <span class="info-cell-value emerald">{{ memberCapitalPledge != null ? '₱' + Number(memberCapitalPledge).toLocaleString('en-PH', { minimumFractionDigits: 2 }) + ' / payday' : '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">BPI Account No.</span>
                  <span class="info-cell-value mono">{{ memberDepositAccNum || '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">Account Type</span>
                  <span class="info-cell-value">{{ memberBankAccountType === '1' ? 'Savings' : memberBankAccountType === '2' ? 'Current' : '—' }}</span>
                </div>
                <div class="info-cell">
                  <span class="info-cell-label">ShareCap Account</span>
                  <span class="info-cell-value">{{ memberShareCapAcc || '—' }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Financial Profile -->
          <div v-else-if="profileSubPage === 'financial-profile'">
            <div class="flex items-center gap-3 mb-5">
              <div class="card-icon-wrap">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 class="card-title">Financial Profile</h2>
                <p class="card-desc">Your cooperative financial standing</p>
              </div>
            </div>

            <div v-if="loadingFinancial" class="inline-loading">
              <div class="spinner spinner-sm" />
              <span>Loading financial profile…</span>
            </div>

            <div v-else class="fin-cards-grid">
              <div class="fin-card" v-for="f in financialProfileCards" :key="f.label">
                <div class="fin-card-icon-wrap" :style="{ background: f.iconBg }">
                  <span v-html="f.icon" :style="{ color: f.iconColor }" />
                </div>
                <div class="fin-card-body">
                  <p class="fin-card-label">{{ f.label }}</p>
                  <p class="fin-card-amount" :class="f.amountClass">{{ formatCurrency(f.value) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Information -->
          <div v-else-if="profileSubPage === 'financial-info'">
            <div class="flex items-center gap-3 mb-5">
              <div class="card-icon-wrap">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <h2 class="card-title">Financial Information</h2>
                <p class="card-desc">Account balances and transaction history</p>
              </div>
            </div>

            <!-- Account type tabs -->
            <div class="fi-tabs">
              <button
                v-for="tab in financialInfoTabs"
                :key="tab.id"
                class="fi-tab"
                :class="{ 'fi-tab--active': activeFinTab === tab.id }"
                @click="selectFinancialTab(tab)"
              >
                <span v-html="tab.icon" />
                <span>{{ tab.label }}</span>
              </button>
            </div>

            <div v-if="loadingAccounts" class="inline-loading">
              <div class="spinner spinner-sm" />
              <span>Loading accounts…</span>
            </div>

            <template v-else>
              <!-- Loan Accounts list (loan tab only) -->
              <template v-if="activeFinTab === 'loan'">
                <div v-if="loanAccounts.length === 0" class="no-account-msg">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p>No Loan account found.</p>
                </div>
                <div v-else class="space-y-8">
                  <div v-for="loanAccount in loanAccounts" :key="loanAccount.accountNumber">
                    <div class="loan-detail-card">
                      <div class="loan-detail-header">
                        <div class="loan-detail-left">
                          <span class="account-bar-badge">LOAN</span>
                          <div>
                            <p class="account-bar-name">{{ loanAccount.loanProductName }}</p>
                            <p class="account-bar-num">{{ loanAccount.accountNumber }}</p>
                          </div>
                        </div>
                        <span :class="['loan-status-chip', loanAccount.loanStatus === 'CURRENT' ? 'loan-status-current' : 'loan-status-other']">{{ loanAccount.loanStatus }}</span>
                      </div>

                      <div class="loan-detail-grid">
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Loan Amount</span>
                          <span class="loan-detail-value">{{ formatCurrency(loanAccount.loanAmount) }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Outstanding Balance</span>
                          <span class="loan-detail-value loan-detail-highlight">{{ formatCurrency(loanAccount.outstandingBalance) }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Amortization</span>
                          <span class="loan-detail-value">{{ formatCurrency(loanAccount.amortization) }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Interest Rate</span>
                          <span class="loan-detail-value">{{ loanAccount.interestRate }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Term</span>
                          <span class="loan-detail-value">{{ loanAccount.termMonths }} months</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Payments Left</span>
                          <span class="loan-detail-value">{{ loanAccount.noOfPaymentsLeft }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">% Paid</span>
                          <span class="loan-detail-value">{{ loanAccount.percentPaid?.toFixed(2) }}%</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Penalty</span>
                          <span class="loan-detail-value" :class="loanAccount.penaltyAmount > 0 ? 'loan-detail-penalty' : ''">{{ formatCurrency(loanAccount.penaltyAmount) }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Date Availed</span>
                          <span class="loan-detail-value">{{ formatDate(loanAccount.dateAvailed) }}</span>
                        </div>
                        <div class="loan-detail-item">
                          <span class="loan-detail-label">Maturity Date</span>
                          <span class="loan-detail-value">{{ formatDate(loanAccount.maturityDate) }}</span>
                        </div>
                      </div>

                      <!-- Progress bar -->
                      <div class="loan-progress-wrap">
                        <div class="loan-progress-labels">
                          <span>Repayment Progress</span>
                          <span>{{ loanAccount.percentPaid?.toFixed(2) }}%</span>
                        </div>
                        <div class="loan-progress-track">
                          <div class="loan-progress-fill" :style="{ width: Math.min(loanAccount.percentPaid ?? 0, 100) + '%' }" />
                        </div>
                      </div>
                    </div>

                    <!-- Transaction History for this loan -->
                    <div class="txn-section mt-6 mb-12">
                      <div class="txn-header">
                        <div class="txn-title-wrap">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                          <p class="txn-title">Transaction History</p>
                        </div>
                        <p class="txn-subtitle">Click any row to view full transaction details</p>
                      </div>

                      <div v-if="loadingTxn" class="inline-loading">
                        <div class="spinner spinner-sm" />
                        <span>Loading transactions…</span>
                      </div>

                      <div v-else-if="!(loanTransactions[loanAccount.accountNumber]?.length)" class="txn-empty">
                        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        <p>No transactions found for this account.</p>
                      </div>

                      <div v-else class="txn-table-wrap">
                        <table class="txn-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Transaction Type</th>
                              <th class="text-right">Amount Paid</th>
                              <th class="text-right">Outstanding Balance</th>
                              <th class="txn-th-action"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(txn, txnIdx) in loanTransactions[loanAccount.accountNumber]" :key="txnIdx">
                              <tr class="txn-row" :class="{ 'txn-row--open': txn.expanded }">
                                <td data-label="Date" class="txn-date">{{ formatDate(txn.transactionDate) }}</td>
                                <td data-label="Type" class="txn-type">{{ txn.transactionType }}</td>
                                <td data-label="Amount" class="text-right">
                                  <span v-if="txn.credit != null && txn.credit > 0" class="txn-credit-val">+{{ formatCurrency(txn.credit) }}</span>
                                  <span v-else-if="txn.debit != null && txn.debit > 0" class="txn-debit-val">-{{ formatCurrency(txn.debit) }}</span>
                                  <span v-else class="txn-neutral">—</span>
                                </td>
                                <td data-label="Balance" class="txn-balance text-right">{{ formatCurrency(txn.outstandingBalance ?? 0) }}</td>
                                <td class="txn-action-cell">
                                  <button class="txn-view-btn" :class="{ 'txn-view-btn--active': txn.expanded }" @click.stop="txn.expanded = !txn.expanded">
                                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {{ txn.expanded ? 'Hide Details' : 'View Details' }}
                                  </button>
                                </td>
                              </tr>
                              <tr v-if="txn.expanded" class="txn-detail-tr">
                                <td colspan="5" class="txn-detail-cell">
                                  <div class="txn-detail-panel">

                                    <!-- Panel Header -->
                                    <div class="txn-detail-header">
                                      <div class="txn-detail-header-left">
                                        <span class="txn-detail-type-chip">{{ txn.transactionType }}</span>
                                        <span class="txn-detail-date-chip">{{ formatDate(txn.transactionDate) }}</span>
                                      </div>
                                      <div class="txn-detail-ref">
                                        <span class="txn-detail-ref-label">Reference No.</span>
                                        <span class="txn-detail-ref-val">{{ txn.trnNo || '—' }}</span>
                                      </div>
                                    </div>

                                    <!-- Panel Body -->
                                    <div class="txn-detail-body">

                                      <!-- Reference & Dates -->
                                      <div class="txn-detail-group">
                                        <p class="txn-detail-group-title">Transaction Info</p>
                                        <div class="txn-detail-row">
                                          <div class="info-cell">
                                            <span class="info-cell-label">Installment No.</span>
                                            <span class="info-cell-value">{{ txn.installmentNo ?? '—' }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Document No.</span>
                                            <span class="info-cell-value">{{ txn.documentNo || '—' }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Particulars</span>
                                            <span class="info-cell-value">{{ txn.particulars || '—' }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Transaction Date</span>
                                            <span class="info-cell-value">{{ formatDate(txn.transactionDate) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Due Date</span>
                                            <span class="info-cell-value">{{ formatDate(txn.dateDue) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Value Date</span>
                                            <span class="info-cell-value">{{ formatDate(txn.valueDate) }}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div class="txn-detail-divider"></div>

                                      <!-- Amounts -->
                                      <div class="txn-detail-group">
                                        <p class="txn-detail-group-title">Payment & Outstanding</p>
                                        <div class="txn-detail-row">
                                          <div class="info-cell">
                                            <span class="info-cell-label">Applied to Principal</span>
                                            <span class="info-cell-value txn-amount-blue">{{ formatCurrency(txn.appliedToPrin) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Applied to Interest</span>
                                            <span class="info-cell-value txn-amount-blue">{{ formatCurrency(txn.appliedToInt) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Applied to AR</span>
                                            <span class="info-cell-value txn-amount-blue">{{ formatCurrency(txn.appliedToAR) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Outstanding Principal</span>
                                            <span class="info-cell-value">{{ formatCurrency(txn.outstandingPrincipal) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Outstanding UII</span>
                                            <span class="info-cell-value">{{ formatCurrency(txn.outstandingUII) }}</span>
                                          </div>
                                          <div class="info-cell">
                                            <span class="info-cell-label">Outstanding AR</span>
                                            <span class="info-cell-value">{{ formatCurrency(txn.outstandingAR) }}</span>
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Account info bar (non-loan tabs) -->
              <template v-else>
                <div v-if="selectedAccount" class="account-bar">
                  <div class="account-bar-left">
                    <div class="account-bar-badge">{{ selectedAccount.accountType?.toUpperCase() }}</div>
                    <div>
                      <p class="account-bar-name">{{ selectedAccount.accountName || memberFullName }}</p>
                      <p class="account-bar-num">{{ selectedAccount.accountNumber }}</p>
                    </div>
                  </div>
                  <div class="account-bar-balance">
                    <p class="account-bar-balance-label">Account Balance</p>
                    <p class="account-bar-balance-val">{{ formatCurrency(selectedAccount.accountBalance ?? 0) }}</p>
                  </div>
                </div>

                <!-- No account found -->
                <div v-else class="no-account-msg">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p>No {{ activeFinTabLabel }} account found.</p>
                </div>

                <!-- Transaction History -->
                <div v-if="selectedAccount" class="txn-section mt-6">
                  <div class="txn-header">
                    <div class="txn-title-wrap">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      <p class="txn-title">Transaction History</p>
                    </div>
                    <p class="txn-subtitle">Recent transactions for this account</p>
                  </div>

                  <div v-if="loadingTxn" class="inline-loading">
                    <div class="spinner spinner-sm" />
                    <span>Loading transactions…</span>
                  </div>

                  <div v-else-if="transactionHistory.length === 0" class="txn-empty">
                    <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    <p>No transactions found for this account.</p>
                  </div>

                  <div v-else class="txn-table-wrap">
                    <table class="txn-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Transaction Type</th>
                          <th class="text-right">Amount</th>
                          <th class="text-right">Outstanding Balance </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(txn, idx) in transactionHistory" :key="idx" class="txn-row">
                          <td data-label="Date" class="txn-date">{{ formatDate(txn.transactionDate) }}</td>
                          <td data-label="Type" class="txn-type">{{ txn.transactionType || (txn.credit != null && txn.credit > 0 ? 'Credit' : (txn.debit != null && txn.debit > 0 ? 'Debit' : '')) }}</td>
                          <td data-label="Amount" class="txn-amount text-right">
                            <span v-if="txn.credit != null && txn.credit > 0" class="text-emerald-600 font-medium">+{{ formatCurrency(txn.credit) }}</span>
                            <span v-else-if="txn.debit != null && txn.debit > 0" class="text-red-600 font-medium">-{{ formatCurrency(txn.debit) }}</span>
                            <span v-else>—</span>
                          </td>
                          <td data-label="Balance" class="txn-balance text-right">{{ formatCurrency(txn.outstandingBalance ?? 0) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </template>
          </div>

        </div>
      </section>



  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, computed, reactive, nextTick } from 'vue'
definePageMeta({ layout: 'portal' })

const authRefresh = useAuthRefresh()
const $fetch = authRefresh.fetchWithAuth
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const router = useRouter()
const authHeaders = authRefresh.authHeaders

// ── State ──────────────────────────────────────
const activePage      = ref('profile')
const profileSubPage  = ref(
  config.public.subPersonalProfile ? 'personal-profile' :
  config.public.subFinancialProfile ? 'financial-profile' :
  config.public.subFinancialInfo ? 'financial-info' : ''
)   // sub-page inside Profile
const sidebarCollapsed = ref(false)
const mobileMenuOpen   = ref(false)
const mobileSubNavOpen = ref(false)
const loadingProfile  = ref(true)

// Personal profile fields
const memberFirstName       = ref('')
const memberLastName        = ref('')
const memberMiddleName      = ref('')
const memberTrn             = ref('')
const memberMemberId        = ref('')
const memberEmail           = ref('')
const memberMobile          = ref('')
const memberCivilStatus     = ref('')
const memberBirthDate       = ref('')
const memberGender          = ref('')
const memberPlaceOfBirth    = ref('')
const memberReligion        = ref('')
const memberEducAttainment  = ref('')
const memberNoOfDependents  = ref<string | number>('')
const memberNationality     = ref('')
const memberCountryOfBirth  = ref('')
const memberEmployer        = ref('')
const memberCompanyCode     = ref('')
const memberPosition        = ref('')
const memberPositionCategory = ref('')
const memberEmployeeId      = ref('')
const memberDateHired       = ref('')
const memberEmploymentType  = ref('')
const memberEmploymentStatus = ref('')
const memberAnnualIncome    = ref('')
const memberSss             = ref('')
const memberTin             = ref('')
const memberTypeDesc        = ref('')
const memberSince           = ref('')
const memberBranch          = ref('')
const memberCluster         = ref('')
const memberShareCapAcc     = ref('')
const memberDepositAccNum   = ref('')
const memberBankAccountType = ref('')
const memberCapitalPledge   = ref<number | null>(null)
const memberSameAddress     = ref(false)
const memberPresentAddress  = reactive({ roomNo: '', houseNo: '', street: '', barangay: '', city: '', province: '', postalCode: '' })
const memberPermAddress     = reactive({ roomNo: '', houseNo: '', street: '', barangay: '', city: '', province: '', postalCode: '' })
const memberBeneficiaries   = ref<any[]>([])
const memberEmergencyContacts = ref<any[]>([])
const lookups = reactive({
  civilStatus: [] as any[], educAttainment: [] as any[], relationships: [] as any[], annualIncome: [] as any[], religion: [] as any[],
  employmentStatuses: [] as any[], employmentTypes: [] as any[], nationalities: [] as any[], countries: [] as any[], positionCategories: [] as any[]
})

const memberFullName = computed(() =>
  [memberFirstName.value, memberLastName.value].filter(Boolean).join(' ') || 'Member'
)
const memberInitials = computed(() => {
  const f = memberFirstName.value?.[0] || ''
  const l = memberLastName.value?.[0] || ''
  return (f + l).toUpperCase() || 'M'
})

// ── Financial profile ──────────────────────────
const loadingFinancial  = ref(false)
const financialProfile  = ref<any>(null)

// ── Financial information ──────────────────────
const loadingAccounts    = ref(false)
const accountDetails     = ref<any[]>([])
const loanAccounts       = ref<any[]>([])
const activeFinTab       = ref('loan')
const loadingTxn         = ref(false)
const transactionHistory = ref<any[]>([])



// ── Personal Profile fields ─────────────────────
const personalProfileFields = computed(() => [
  { label: 'Name',                   value: memberFullName.value },
  { label: 'Member ID No.',          value: memberMemberId.value },
  { label: 'Membership Type',        value: memberTypeDesc.value },
  { label: 'Member Since',           value: memberSince.value ? formatDisplayDate(memberSince.value) : '' },
  { label: 'SSS',                    value: memberSss.value },
  { label: 'TIN',                    value: memberTin.value },
  { label: 'Company',                value: memberEmployer.value },
  { label: 'Email',                  value: memberEmail.value },
  { label: 'Branch',                 value: memberBranch.value },
  { label: 'Position',               value: memberPosition.value },
  { label: 'Cluster',                value: memberCluster.value },
  { label: 'ShareCap Account',       value: memberShareCapAcc.value },
  { label: 'Deposit Account Number', value: memberDepositAccNum.value },
])

// ── Financial profile cards ─────────────────────
const financialProfileCards = computed(() => [
  { label: 'Outstanding Share Capital',    value: financialProfile.value?.outstandingShareCapital ?? 0,    iconBg: '#eff6ff', iconColor: '#1e3a8a', amountClass: 'amount-blue',
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
  { label: 'Outstanding Refund',           value: financialProfile.value?.outstandingRefund ?? 0,          iconBg: '#eff6ff', iconColor: '#1e3a8a', amountClass: 'amount-blue',
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>' },
  { label: 'Outstanding Dividend',         value: financialProfile.value?.outstandingDividend ?? 0,        iconBg: '#eff6ff', iconColor: '#1e3a8a', amountClass: 'amount-blue',
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
  { label: 'Outstanding Patronage',        value: financialProfile.value?.outstandingPatronage ?? 0,       iconBg: '#eff6ff', iconColor: '#1e3a8a', amountClass: 'amount-blue',
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  { label: 'Outstanding Loan as Borrower', value: financialProfile.value?.outstandingLoanBalance ?? 0,     iconBg: '#eff6ff', iconColor: '#1e3a8a', amountClass: 'amount-blue',
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { label: 'Net Financial Contribution / (Exposure)',   value: financialProfile.value?.netFinancialContribution ?? 0,  iconBg: '#eff6ff', iconColor: '#1e3a8a', amountClass: 'amount-blue',
    icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
])

// ── Financial info tabs ─────────────────────────
const financialInfoTabs = [
  { id: 'loan',          label: 'Loan Account',  icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { id: 'Share Capital', label: 'Share Capital', icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2-2h-2a2 2 0 01-2-2z"/></svg>' },
  { id: 'Dividend',      label: 'Dividends',     icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
  { id: 'Patronage',     label: 'Patronage',     icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  { id: 'Refund',        label: 'Refund',        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>' },
]

const activeFinTabLabel = computed(() => financialInfoTabs.find(t => t.id === activeFinTab.value)?.label ?? '')

const selectedAccount = computed(() => {
  if (activeFinTab.value === 'loan') return null
  return accountDetails.value.find(a => a.accountType === activeFinTab.value) ?? null
})

const loanTransactions = ref<Record<string, any[]>>({})

// ── Status items ───────────────────────────────
const statusItems = computed(() => [
  { label: 'Full Data Entry',        date: 'Completed',   status: 'Approved',    dotClass: 'dot-green', chipClass: 'chip-green' },
  { label: 'Membership Application', date: 'In progress', status: 'Pending',     dotClass: 'dot-amber', chipClass: 'chip-amber' },
  { label: 'Loan Application',       date: 'Not started', status: 'Not Applied', dotClass: 'dot-gray',  chipClass: 'chip-gray'  },
])

// ── Change Password ────────────────────────────
const pwdForm    = reactive({ current: '', newPwd: '', confirm: '' })
const showPwd    = reactive({ current: false, newPwd: false, confirm: false })
const changingPwd = ref(false)
const pwdError   = ref('')
const pwdSuccess = ref(false)
const pwdMatch   = computed(() =>
  pwdForm.current.length > 0 && pwdForm.newPwd.length > 0 && pwdForm.newPwd === pwdForm.confirm
)

// ── Switch sub-page and lazy-load ─────────────
async function switchProfileSub(sub: string) {
  profileSubPage.value = sub
  mobileSubNavOpen.value = false   // close mobile sub-nav after selection
  if (sub === 'financial-profile') await loadFinancialProfile()
  if (sub === 'financial-info')    await loadFinancialInfo()
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

// ── Helpers ────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null || Number(val) === 0) return '-'
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(val))
}
function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ''
  try { return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return dateStr }
}
function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try { return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return dateStr }
}

// ── API calls ──────────────────────────────────
async function loadFinancialProfile() {
  loadingFinancial.value = true
  try {
    const res = await $fetch<any>(`${apiBase}/accounts/financial-profile`, { headers: authHeaders() })
    financialProfile.value = res?.financialProfile ?? null
  } catch (e) { console.error('Failed to load financial profile', e) }
  finally { loadingFinancial.value = false }
}

async function loadFinancialInfo() {
  loadingAccounts.value = true
  try {
    const [accRes, loanRes] = await Promise.allSettled([
      $fetch<any>(`${apiBase}/accounts/all`,     { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/loan-account/all`, { headers: authHeaders() }),
    ])
    if (accRes.status === 'fulfilled')  accountDetails.value = accRes.value?.accountDetails ?? []
    if (loanRes.status === 'fulfilled') {
      const loanData = loanRes.value
      loanAccounts.value = Array.isArray(loanData) ? loanData : (loanData?.loans ?? loanData?.loanAccounts ?? loanData?.data ?? [])
    }
  } catch (e) { console.error('Failed to load financial info', e) }
  finally { loadingAccounts.value = false }
  await loadTransactionHistory()
}

async function loadTransactionHistory() {
  loadingTxn.value = true
  transactionHistory.value = []
  try {
    const isLoan = activeFinTab.value === 'loan'
    
    if (isLoan) {
      // Fetch transactions for all loans
      await Promise.all(loanAccounts.value.map(async (loan) => {
        try {
          const res = await $fetch<any>(`${apiBase}/loan-account/transactions`, {
            headers: authHeaders(),
            params: { accountNumber: loan.accountNumber }
          })
          let txns = res?.transactionHistory ?? res?.transactions ?? res ?? []
          if (!Array.isArray(txns)) txns = []
          txns = txns.map((t: any) => ({
            ...t,
            transactionDate: t.duePaid || t.valueDate,
            transactionType: t.transactionType,
            credit: t.amountPaid,
            debit: null,
            outstandingBalance: t.outstandingBalance,
            expanded: false
          }))
          loanTransactions.value[loan.accountNumber] = txns
        } catch (e) {
          loanTransactions.value[loan.accountNumber] = []
        }
      }))
    } else {
      const acc = selectedAccount.value
      if (!acc?.accountNumber) { transactionHistory.value = []; return }
      
      const res = await $fetch<any>(`${apiBase}/accounts/transaction-history`, {
        headers: authHeaders(),
        params: { accountNumber: acc.accountNumber }
      })
      
      let txns = res?.transactionHistory ?? res?.transactions ?? res ?? []
      if (!Array.isArray(txns)) txns = []
      transactionHistory.value = txns
    }
  } catch (e) { console.error('Failed to load transactions', e); transactionHistory.value = [] }
  finally { loadingTxn.value = false }
}

async function selectFinancialTab(tab: any) {
  activeFinTab.value = tab.id
  await nextTick()
  await loadTransactionHistory()
}

async function handleChangePassword() {
  if (!pwdMatch.value) return
  changingPwd.value = true; pwdError.value = ''; pwdSuccess.value = false
  try {
    await $fetch<any>(`${apiBase}/auth/change-password`, {
      method: 'POST', headers: authHeaders(),
      body: { currentPassword: pwdForm.current, newPassword: pwdForm.newPwd }
    })
    pwdSuccess.value = true
    pwdForm.current = ''; pwdForm.newPwd = ''; pwdForm.confirm = ''
    
    // Backend requires re-login after password change
    setTimeout(() => {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('refresh_token')
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    pwdError.value = err?.data?.message ?? err?.message ?? 'Failed to change password.'
  } finally { changingPwd.value = false }
}

// ── Logout confirmation ────────────────────────────────────────
const showLogoutConfirm = ref(false)
const loggingOut = ref(false)

async function handleLogout() {
  loggingOut.value = true
  try {
    await authRefresh.logout()
  } finally {
    loggingOut.value = false
    showLogoutConfirm.value = false
  }
}

onUnmounted(() => { authRefresh.stopTokenRefresh() })

// ── Mount ──────────────────────────────────────
onMounted(async () => {
  authRefresh.initTokenRefresh()
  const token = sessionStorage.getItem('auth_token')
  if (!token) { router.push('/login'); return }
  try {
    const [whoamiRes, appRes, civil, educ, rel, income, religion, empStatuses, empTypes, nationalities, countries, posCat] = await Promise.allSettled([
      authRefresh.fetchWhoamiCached(),
      $fetch<any>(`${apiBase}/member-application`, { method: 'GET', headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/code-name?codeName=CIVILSTATUS`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/code-name?codeName=EDUCATTAINMENT`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/code-name?codeName=RELATIONSHIP`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/code-name?codeName=ANNUALINCOME`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/code-name?codeName=RELIGION`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/member-application/employment-statuses`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/member-application/employment-types`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/nationality`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/country`, { headers: authHeaders() }),
      $fetch<any>(`${apiBase}/system-parameters/code-name?codeName=POSITIONCATEGORY`, { headers: authHeaders() })
    ])
    
    // Assign lookups for description resolution
    lookups.civilStatus    = civil.status    === 'fulfilled' && Array.isArray(civil.value)    ? civil.value    : []
    lookups.educAttainment = educ.status     === 'fulfilled' && Array.isArray(educ.value)     ? educ.value     : []
    lookups.relationships  = rel.status      === 'fulfilled' && Array.isArray(rel.value)      ? rel.value      : []
    lookups.annualIncome   = income.status   === 'fulfilled' && Array.isArray(income.value)   ? income.value   : []
    lookups.religion       = religion.status === 'fulfilled' && Array.isArray(religion.value) ? religion.value : []
    lookups.employmentStatuses = empStatuses.status === 'fulfilled' ? (Array.isArray(empStatuses.value) ? empStatuses.value : (empStatuses.value?.data ?? [])) : []
    lookups.employmentTypes = empTypes.status === 'fulfilled' ? (Array.isArray(empTypes.value) ? empTypes.value : (empTypes.value?.data ?? [])) : []
    lookups.nationalities = nationalities.status === 'fulfilled' && Array.isArray(nationalities.value) ? nationalities.value : []
    lookups.countries = countries.status === 'fulfilled' && Array.isArray(countries.value) ? countries.value : []
    lookups.positionCategories = posCat.status === 'fulfilled' && Array.isArray(posCat.value) ? posCat.value : []
    
    if (whoamiRes.status === 'fulfilled') {
      const pd = whoamiRes.value?.userDetails?.personalDetails
      const ed = whoamiRes.value?.userDetails?.employmentDetails
      memberFirstName.value     = pd?.firstName            || ''
      memberMiddleName.value    = pd?.middleName           || ''
      memberLastName.value      = pd?.lastName             || ''
      memberSss.value           = pd?.sss                  || ''
      memberTin.value           = pd?.tin                  || ''
      memberTypeDesc.value      = pd?.memberTypeDescription|| ''
      memberMemberId.value      = pd?.memberId             || ''
      memberTrn.value           = pd?.trn                  || ''
      memberShareCapAcc.value   = pd?.shareCapitalPledge   || ''
      memberDepositAccNum.value  = pd?.depositAccountNumber || ''
      memberSince.value         = pd?.memberSince          || ''
      memberBranch.value        = ed?.branch               || ''
      memberCluster.value       = ed?.cluster              || ''
      memberEmployer.value      = ed?.companyName          || ''
      memberPosition.value      = ed?.position             || ''
    }
    if (appRes.status === 'fulfilled') {
      const app = appRes.value
      const d = app?.details
      if (d) {
        if (!memberTrn.value)   memberTrn.value   = d.trn          || ''
        if (!memberEmail.value) memberEmail.value = d.emailAddress || ''
        memberCivilStatus.value    = d.civilStatus      || ''
        memberGender.value         = d.gender           || ''
        memberBirthDate.value      = d.dateOfBirth ? String(d.dateOfBirth).substring(0, 10) : ''
        memberPlaceOfBirth.value   = d.placeOfBirth     || ''
        memberReligion.value       = d.religion         || ''
        memberEducAttainment.value = d.educAttainment   || ''
        memberNoOfDependents.value = d.noOfDependents !== undefined && d.noOfDependents !== null ? String(d.noOfDependents) : ''
        memberNationality.value    = d.nationality      || ''
        memberCountryOfBirth.value = d.countryOfBirth   || ''
        memberBankAccountType.value = d.bankAccountType || ''
        if (!memberDepositAccNum.value) memberDepositAccNum.value = d.bankAccountNumber || ''
        const area = d.areaCodeMobile || ''
        const num  = d.mobileNumber   || ''
        memberMobile.value = area || num ? `+63 ${area}${num}` : ''
        // Present address
        memberPresentAddress.roomNo     = d.roomNo1   || ''
        memberPresentAddress.houseNo    = d.houseNo1  || ''
        memberPresentAddress.street     = d.streetNo1 || ''
        memberPresentAddress.barangay   = d.barangay1 || ''
        memberPresentAddress.city       = d.city1     || ''
        memberPresentAddress.province   = d.province1 || ''
        memberPresentAddress.postalCode = d.postalCode1 || ''
        // Permanent address
        memberPermAddress.roomNo     = d.roomNo2   || ''
        memberPermAddress.houseNo    = d.houseNo2  || ''
        memberPermAddress.street     = d.streetNo2 || ''
        memberPermAddress.barangay   = d.barangay2 || ''
        memberPermAddress.city       = d.city2     || ''
        memberPermAddress.province   = d.province2 || ''
        memberPermAddress.postalCode = d.postalCode2 || ''
        // Same-address flag
        const addrFields = ['street', 'barangay', 'city', 'province', 'postalCode']
        memberSameAddress.value = d.sameAsPresentAddress === true ||
          (!!memberPresentAddress.street && addrFields.every(f => (memberPresentAddress[f] || '') === (memberPermAddress[f] || '')))
        // Beneficiaries
        if (d.beneficiaries?.length) {
          memberBeneficiaries.value = d.beneficiaries.map((b: any) => ({
            firstName: b.firstName || '', lastName: b.lastName || '',
            dateOfBirth: b.dateOfBirth ? String(b.dateOfBirth).substring(0, 10) : '',
            relationship: b.relationship || '', mobileNo: b.mobileNo || ''
          }))
        }
      }
      // Employment from app
      const e = app?.employment
      if (e) {
        if (!memberEmployer.value) memberEmployer.value = e.companyName || ''
        memberCompanyCode.value      = e.companyCode      || ''
        memberPositionCategory.value = e.positionCategory || ''
        memberEmployeeId.value       = e.employerId       || ''
        memberDateHired.value        = e.dateHiredFrom ? String(e.dateHiredFrom).substring(0, 10) : ''
        memberEmploymentType.value   = e.employmentType   || ''
        memberEmploymentStatus.value = e.employmentStatus || ''
        memberAnnualIncome.value     = e.annualIncome      || ''
      }
      // Capital pledge
      const cp = app?.capitalPledge
      if (cp) memberCapitalPledge.value = cp.amount ?? null
      // Emergency contacts
      if (app?.emergencyContacts?.length) {
        memberEmergencyContacts.value = app.emergencyContacts.map((ec: any) => ({
          fullName: ec.fullName || '', gender: ec.gender || '',
          dateOfBirth: ec.dateOfBirth ? String(ec.dateOfBirth).substring(0, 10) : '',
          contactNumber: ec.contactNumber || '', address: ec.address || '',
          relationship: ec.relationship || ''
        }))
      }
    }
  } catch { router.push('/login') }
  finally { loadingProfile.value = false }
})
</script>

<style scoped>
/* ─── Reset & Base ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }

/* ─── Shell ────────────────────────────────────────── */
.shell { display: flex; min-height: 100vh; background: #f6f7f9; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
.flex-1 { flex: 1; }

/* ─── Mobile overlay ──────────────────────────────── */
.mobile-overlay {
  display: none;
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  z-index: 40; backdrop-filter: blur(2px);
}

/* ─── Sidebar ──────────────────────────────────────── */
.sidebar {
  width: 248px; min-height: 100vh; background: #ffffff;
  border-right: 1px solid #e8eaed; display: flex; flex-direction: column;
  flex-shrink: 0; transition: width 0.28s cubic-bezier(.4,0,.2,1);
  position: sticky; top: 0; height: 100vh; overflow: hidden;
}
.collapsed .sidebar { width: 64px; }

/* Hamburger (hidden on desktop) */
.hamburger-btn { display: none; }
.sidebar-header { display: flex; align-items: center; gap: 10px; padding: 20px 16px 16px; border-bottom: 1px solid #f1f3f5; }
.logo-img { width: 32px; height: 32px; object-fit: contain; flex-shrink: 0; }
.logo-text { overflow: hidden; white-space: nowrap; }
.brand-name { display: block; font-size: 13px; font-weight: 800; color: #111827; letter-spacing: -0.01em; }
.brand-sub  { display: block; font-size: 10px; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em; text-transform: uppercase; }

.nav-divider { height: 1px; background: #f1f3f5; margin: 4px 0; }
.nav { padding: 8px; overflow-y: auto; }
.nav-group-label { font-size: 10px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.12em; padding: 8px 8px 4px; }
.nav-btn { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 10px; border-radius: 8px; color: #6b7280; font-size: 13px; font-weight: 600; text-align: left; transition: all 0.14s ease; margin-bottom: 1px; white-space: nowrap; overflow: hidden; }
.nav-btn:hover { background: #f3f4f6; color: #111827; }
.nav-btn--active { background: #eff6ff !important; color: #1d4ed8 !important; font-weight: 700; }
.nav-icon { display: flex; align-items: center; flex-shrink: 0; }
.nav-label { flex: 1; }
.toggle-btn { display: flex; align-items: center; gap: 8px; width: calc(100% - 20px); margin: 0 10px 6px; padding: 9px 12px; border-radius: 8px; border: 1px solid #e8eaed; color: #9ca3af; font-size: 12px; font-weight: 600; transition: all 0.15s; justify-content: center; }
.toggle-btn:hover { background: #f3f4f6; color: #374151; }
.logout-btn { display: flex; align-items: center; gap: 9px; width: calc(100% - 20px); margin: 0 10px 20px; padding: 9px 12px; border-radius: 8px; border: 1px solid #fecaca; color: #ef4444; background: #fff5f5; font-size: 12px; font-weight: 600; transition: all 0.15s; overflow: hidden; white-space: nowrap; justify-content: center; }
.logout-btn:hover { background: #fee2e2; border-color: #fca5a5; }

/* ─── Main area ────────────────────────────────────── */
.main-area { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.topbar { display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 16px 0 28px; background: #ffffff; border-bottom: 1px solid #e8eaed; position: sticky; top: 0; z-index: 30; gap: 16px; }
.topbar-breadcrumb { display: flex; align-items: center; gap: 12px; }
.breadcrumb-icon { width: 34px; height: 34px; border-radius: 9px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #374151; flex-shrink: 0; }
.breadcrumb-section { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
.breadcrumb-title   { font-size: 15px; font-weight: 800; color: #111827; line-height: 1.2; }
.topbar-member { display: flex; align-items: center; gap: 10px; }
.topbar-avatar { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #1d4ed8, #4f46e5); color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.topbar-name { font-size: 12px; font-weight: 700; color: #111827; }
.topbar-role { font-size: 10px; font-weight: 500; color: #9ca3af; }

/* Loading */
.loading-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: #9ca3af; font-size: 12px; font-weight: 600; }
.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #1d4ed8; border-radius: 50%; animation: spin 0.65s linear infinite; }
.spinner-sm { width: 18px; height: 18px; border-width: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }
.inline-loading { display: flex; align-items: center; gap: 8px; padding: 24px 0; color: #6b7280; font-size: 13px; font-weight: 500; }

/* ─── Pages ────────────────────────────────────────── */
.page { padding: 28px 32px; animation: fadeUp 0.25s ease-out; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.sub-anim { animation: fadeUp 0.22s ease-out; }

/* ─── Profile Page ───────────────────────────────────── */
.profile-page { padding: 0 !important; display: flex; flex-direction: column; min-height: calc(100vh - 60px); }

/* ── Profile Tab Bar ── */
.profile-tab-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #fff;
  border-bottom: 1px solid #e8eaed;
  padding: 0 32px;
  position: sticky;
  top: 60px;
  z-index: 20;
}
.profile-tab {
  display: flex; align-items: center; gap: 7px;
  padding: 14px 18px;
  font-size: 13px; font-weight: 600;
  color: #6b7280;
  border-bottom: 2.5px solid transparent;
  transition: all 0.18s ease;
  white-space: nowrap;
  position: relative;
  top: 1px;
}
.profile-tab:hover { color: #1d4ed8; background: #f5f8ff; border-radius: 6px 6px 0 0; }
.profile-tab--active { color: #1d4ed8 !important; border-bottom-color: #1d4ed8; font-weight: 700; }
.profile-tab-icon { width: 15px; height: 15px; flex-shrink: 0; }

/* ── Profile Content Area ── */
.profile-content {
  flex: 1;
  padding: 28px 32px;
}

/* ── Member Hero Card ── */
.member-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 24px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(29, 78, 216, 0.18);
}
.member-hero-avatar {
  width: 64px; height: 64px;
  border-radius: 16px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.35);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; color: #fff;
  flex-shrink: 0;
  letter-spacing: -0.01em;
}
.member-hero-info { flex: 1; min-width: 0; }
.member-hero-name {
  font-size: 22px; font-weight: 800; color: #fff;
  letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 8px;
}
.member-hero-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.member-hero-badge {
  display: inline-flex; align-items: center;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 99px;
  padding: 3px 12px;
  font-size: 11px; font-weight: 700;
  color: #fff; letter-spacing: 0.04em;
}
.member-hero-sep { color: rgba(255,255,255,0.45); font-size: 12px; }
.member-hero-id  { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); }
.member-hero-since { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.65); }

/* ── Info Sections ── */
.info-section-card {
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: box-shadow 0.15s;
}
.info-section-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
.info-section-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 14px;
}
.info-section-dot { width: 3px; height: 14px; border-radius: 99px; flex-shrink: 0; }
.info-section-title { font-size: 11px; font-weight: 900; color: #1e293b; text-transform: uppercase; letter-spacing: 0.13em; }
.info-divider { height: 1px; background: #f1f3f5; margin: 20px 0; }
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 4px;
}
@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}
@media (min-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.info-cell { display: flex; flex-direction: column; gap: 4px; }
.info-cell-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
.info-cell-value { font-size: 13px; font-weight: 600; color: #111827; line-height: 1.4; }
.info-cell-sub { font-size: 11px; font-weight: 500; color: #6b7280; }
.info-cell-value.emerald { color: #059669; }
.info-cell-value.mono { font-family: ui-monospace, monospace; }
.info-address-block { font-size: 13px; font-weight: 600; color: #111827; background: #f8f9fb; border-radius: 10px; padding: 12px 16px; line-height: 1.6; }
.info-empty { font-size: 13px; font-weight: 500; color: #9ca3af; padding: 10px 0; }
.info-list { display: flex; flex-direction: column; gap: 0; }
.info-list-item { padding: 12px 0; }
.info-list-item--bordered { border-bottom: 1px solid #f1f3f5; padding-bottom: 16px; margin-bottom: 4px; }

/* ── Profile Section Header (Financial tabs) ── */
.profile-section-header {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 24px;
}
.profile-section-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.profile-section-title { font-size: 17px; font-weight: 800; color: #111827; line-height: 1.2; }
.profile-section-desc  { font-size: 12px; font-weight: 500; color: #6b7280; margin-top: 3px; }

/* ─── Card (kept for other pages) ──────────────────────────────────────────── */
.page-card { background: #fff; border: 1px solid #e8eaed; border-radius: 16px; padding: 28px 32px; }
.card-head { display: flex; align-items: center; gap: 14px; padding-bottom: 20px; margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; }
.card-icon-wrap { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.card-title { font-size: 16px; font-weight: 800; color: #111827; }
.card-desc  { font-size: 12px; font-weight: 500; color: #6b7280; margin-top: 2px; }

/* Info table (kept for legacy) */
.info-table { display: flex; flex-direction: column; }
.info-row { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 11px 0; border-bottom: 1px solid #f3f4f6; }
.info-row:last-child { border-bottom: none; }
.info-key { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.09em; flex-shrink: 0; }
.info-val { font-size: 13px; font-weight: 600; color: #111827; text-align: right; }

/* ─── Financial Profile Cards ──────────────────────── */
.fin-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; }
.fin-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 14px;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
}
.fin-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); border-color: #c7d2fe; transform: translateY(-1px); }
.fin-card-icon-wrap { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fin-card-body { flex: 1; min-width: 0; }
.fin-card-label  { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 3px; }
.fin-card-amount { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.amount-blue    { color: var(--color-primary-900); } .amount-red    { color: #e11d48; }
.amount-yellow  { color: #ca8a04; } .amount-green  { color: #16a34a; }
.amount-purple  { color: #7c3aed; } .amount-emerald{ color: #059669; }

/* ─── Financial Info Tabs ──────────────────────────── */
.fi-tabs {
  display: flex; gap: 6px; flex-wrap: wrap;
  margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #f1f3f5;
}
.fi-tab {
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  gap: 5px; padding: 7px 14px;
  border-radius: 99px; border: 1.5px solid #e5e7eb;
  color: #6b7280; font-size: 12px; font-weight: 600;
  transition: all 0.14s; background: #fff;
}
.fi-tab:hover { border-color: #bfdbfe; color: var(--color-primary-900); background: #eff6ff; }
.fi-tab--active { background: var(--color-primary-900); border-color: var(--color-primary-900); color: #fff; }

/* Loan Detail Card */
.loan-detail-card {
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}
.loan-detail-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; margin-bottom: 24px; padding-bottom: 18px;
  border-bottom: 1px solid #f1f3f5;
}
.loan-detail-left { display: flex; align-items: center; gap: 14px; }
.loan-status-chip {
  font-size: 10px; font-weight: 800; padding: 4px 12px;
  border-radius: 99px; letter-spacing: 0.1em;
  text-transform: uppercase; flex-shrink: 0;
}
.loan-status-current { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
.loan-status-other   { background: #fef9c3; color: #92400e; border: 1px solid #fef08a; }
.loan-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px 16px; margin-bottom: 28px; }
@media (min-width: 640px) {
  .loan-detail-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
}
@media (min-width: 1024px) {
  .loan-detail-grid { grid-template-columns: repeat(4, 1fr); }
}
.loan-detail-item { display: flex; flex-direction: column; gap: 5px; }
.loan-detail-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; }
.loan-detail-value { font-size: 13px; font-weight: 700; color: #111827; }
.loan-detail-highlight { font-size: 18px; font-weight: 800; color: var(--color-primary-900); letter-spacing: -0.02em; }
.loan-detail-penalty   { color: #dc2626; }
.loan-progress-wrap  { display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px dashed #e8eaed; }
.loan-progress-labels { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
.loan-progress-track { height: 6px; background: #f1f3f5; border-radius: 99px; overflow: hidden; }
.loan-progress-fill  { height: 100%; background: var(--color-primary-600); border-radius: 99px; transition: width 0.6s ease; }

/* Account bar */
.account-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 18px;
  background: #f8faff;
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  margin-bottom: 20px;
}
.account-bar-left { display: flex; align-items: center; gap: 12px; }
.account-bar-badge {
  padding: 4px 10px; border-radius: 6px;
  background: var(--color-primary-900); color: #fff;
  font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
}
.account-bar-name { font-size: 13px; font-weight: 700; color: #111827; }
.account-bar-num  { font-size: 11px; font-weight: 500; color: #6b7280; margin-top: 1px; font-variant-numeric: tabular-nums; }
.account-bar-balance { text-align: right; }
.account-bar-balance-label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
.account-bar-balance-val   { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.02em; }
.no-account-msg {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 40px; color: #9ca3af; font-size: 13px; font-weight: 500;
  border: 1.5px dashed #e5e7eb; border-radius: 12px;
}

/* ── Transaction Section ─────────────────────────────── */
.txn-section { margin-top: 8px; }
.txn-header  { margin-bottom: 20px; }
.txn-title-wrap { display: flex; align-items: center; gap: 8px; color: var(--color-primary-900); margin-bottom: 4px; }
.txn-title   { font-size: 15px; font-weight: 800; color: #111827; }
.txn-subtitle { font-size: 12px; font-weight: 500; color: #6b7280; margin-left: 28px; }
.txn-empty   { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px; color: #9ca3af; font-size: 13px; font-weight: 500; }

/* Table */
.txn-table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid #e8eaed; background: #fff; }
.txn-table { width: 100%; border-collapse: collapse; }
.txn-table thead tr { background: #f8f9fb; border-bottom: 1px solid #e8eaed; }
.txn-table th { padding: 12px 18px; text-align: left; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
.txn-table th.text-right { text-align: right; }
.txn-th-action { width: 120px; }
.txn-row { border-bottom: 1px solid #f1f3f5; transition: background 0.15s ease; }
.txn-row:last-child { border-bottom: none; }
.txn-row:hover { background: #f8faff; }
.txn-row--open { background: #f8faff !important; border-bottom-color: transparent; }
.txn-table td { padding: 14px 18px; font-size: 13px; vertical-align: middle; }
.txn-date    { color: #6b7280; font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums; }
.txn-type    { color: #111827; font-weight: 600; }
.txn-credit-val { color: #15803d; font-weight: 700; font-variant-numeric: tabular-nums; }
.txn-debit-val  { color: #dc2626; font-weight: 700; font-variant-numeric: tabular-nums; }
.txn-neutral    { color: #9ca3af; }
.txn-balance    { color: var(--color-primary-900); font-weight: 700; font-variant-numeric: tabular-nums; }
.text-right     { text-align: right; }

/* View Details Button */
.txn-action-cell { text-align: right; white-space: nowrap; }
.txn-view-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  font-size: 11px; font-weight: 700;
  color: var(--color-primary-900); background: #eff6ff;
  border: 1px solid #bfdbfe; border-radius: 99px;
  cursor: pointer; transition: all 0.15s ease;
  white-space: nowrap;
}
.txn-view-btn:hover { background: #dbeafe; border-color: #93c5fd; }
.txn-view-btn--active { background: var(--color-primary-900); color: #fff; border-color: var(--color-primary-900); }
.txn-view-btn--active:hover { background: var(--color-primary-800); }

/* ── Transaction Detail Panel ──────────────────────── */
.txn-detail-tr td { padding: 0 !important; }
.txn-detail-cell { padding: 0 !important; border-bottom: 1px solid #e8eaed; }
.txn-detail-panel {
  background: #fff;
  border-left: 4px solid var(--color-primary-900);
  padding-bottom: 8px;
  animation: txnDetailSlide 0.2s ease;
}
@keyframes txnDetailSlide {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Panel header */
.txn-detail-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px;
  background: #f8faff;
  border-bottom: 1px solid #e8eaed;
  flex-wrap: wrap; gap: 12px;
}
.txn-detail-header-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.txn-detail-type-chip {
  font-size: 10px; font-weight: 800; color: var(--color-primary-900);
  background: #eff6ff; padding: 4px 12px; border-radius: 6px; letter-spacing: 0.05em;
}
.txn-detail-date-chip {
  font-size: 11px; font-weight: 600; color: #6b7280;
  background: #f1f3f5; padding: 4px 12px; border-radius: 6px;
}
.txn-detail-ref { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.txn-detail-ref-label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
.txn-detail-ref-val   { font-size: 13px; font-weight: 700; color: var(--color-primary-900); font-variant-numeric: tabular-nums; }

/* Panel body */
.txn-detail-body { padding: 0 24px; display: flex; flex-direction: column; }

/* Groups */
.txn-detail-group { padding: 20px 0; }
.txn-detail-group-title {
  font-size: 10px; font-weight: 800; color: var(--color-primary-900);
  text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.txn-detail-group-title::before {
  content: '';
  display: inline-block; width: 4px; height: 14px;
  background: var(--color-primary-900); border-radius: 2px; flex-shrink: 0;
}
.txn-detail-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 24px;
}
.txn-detail-divider { height: 1px; background: #f1f3f5; }
.txn-amount-blue { color: var(--color-primary-900) !important; font-weight: 800 !important; }

/* Status */
.status-list { display: flex; flex-direction: column; }
.status-row  { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
.status-row:last-child { border-bottom: none; }
.status-row-left { display: flex; align-items: center; gap: 12px; }
.status-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #22c55e; } .dot-amber { background: #f59e0b; } .dot-gray { background: #d1d5db; }
.status-label { font-size: 13px; font-weight: 600; color: #111827; }
.status-sub   { font-size: 11px; font-weight: 500; color: #9ca3af; margin-top: 1px; }
.status-chip  { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.07em; }
.chip-green { background: #dcfce7; color: #15803d; } .chip-amber { background: #fef9c3; color: #92400e; } .chip-gray { background: #f3f4f6; color: #6b7280; }

/* Under Construction */
.coming-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 32px; gap: 12px; }
.coming-construction-icon { width: 80px; height: 80px; border-radius: 20px; background: var(--client-bg, #f8fafc); border: 1.5px solid var(--client-border, #e2e8f0); display: flex; align-items: center; justify-content: center; color: #1e3a8a; margin-bottom: 4px; }
.coming-emoji { font-size: 44px; line-height: 1; }
.coming-title { font-size: 18px; font-weight: 800; color: #111827; }
.coming-desc  { font-size: 13px; font-weight: 500; color: #6b7280; max-width: 380px; line-height: 1.65; }
.coming-chip  { display: inline-flex; background: #eff6ff; color: #1d4ed8; font-size: 10px; font-weight: 700; padding: 4px 14px; border-radius: 99px; border: 1px solid #bfdbfe; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px; }

/* Change password */
.form-stack { display: flex; flex-direction: column; gap: 20px; }
.fgroup { display: flex; flex-direction: column; gap: 6px; }
.flabel { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.09em; }
.finput-wrap { position: relative; }
.finput { width: 100%; padding: 10px 44px 10px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 500; color: #111827; outline: none; transition: all 0.14s; }
.finput:hover { border-color: #d1d5db; }
.finput:focus { background: #fff; border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(29,78,216,0.1); }
.feye { position: absolute; top: 0; bottom: 0; right: 12px; display: flex; align-items: center; color: #9ca3af; transition: color 0.14s; }
.feye:hover { color: #374151; }
.match-hint { font-size: 11px; font-weight: 600; margin-top: 4px; }
.match-ok { color: #16a34a; } .match-err { color: #dc2626; }
.submit-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 20px; background: #1d4ed8; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; transition: all 0.18s; }
.submit-btn:hover:not(:disabled) { background: #1e40af; box-shadow: 0 4px 16px rgba(29,78,216,0.28); }
.submit-btn:active:not(:disabled) { transform: scale(0.99); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Alerts */
.alert { display: flex; align-items: center; gap: 8px; padding: 11px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
.alert-ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
.alert-err { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; }

/* Sidebar transitions */
.slide-fade-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.slide-fade-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; position: absolute; }
.slide-fade-enter-from   { opacity: 0; transform: translateX(-6px); }
.slide-fade-leave-to     { opacity: 0; transform: translateX(-6px); }

/* ═══════════════════════════════════════════════════════
   RESPONSIVE — Tablet & Mobile (≤ 1024px)
═══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {

  /* Overlay visible */
  .mobile-overlay { display: block; }

  /* Hamburger visible */
  .hamburger-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 8px;
    border: 1px solid #e8eaed; color: #374151;
    background: #f9fafb; flex-shrink: 0;
    transition: background 0.14s;
  }
  .hamburger-btn:hover { background: #f3f4f6; }

  /* Sidebar becomes a fixed drawer */
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0; bottom: 0;
    width: 260px !important;
    z-index: 50;
    transition: left 0.28s cubic-bezier(.4,0,.2,1), width 0s;
    box-shadow: 4px 0 24px rgba(0,0,0,0.12);
  }
  .sidebar.mobile-open { left: 0; }
  /* Hide collapse toggle & avatar-centered on mobile drawer */
  .toggle-btn { display: none; }
  .avatar-centered { display: none; }

  /* Topbar: tighter padding, breadcrumb shrinks */
  .topbar { padding: 0 16px; height: 56px; }
  .breadcrumb-section { display: none; }
  .breadcrumb-title { font-size: 15px; }
  .topbar-name, .topbar-role { display: none; }
  .topbar-avatar { width: 30px; height: 30px; font-size: 10px; }

  /* Profile tab bar */
  .profile-tab-bar {
    padding: 0 16px;
    overflow-x: auto;
    scrollbar-width: none;
    top: 56px;
  }
  .profile-tab-bar::-webkit-scrollbar { display: none; }
  .profile-tab { padding: 12px 14px; font-size: 12px; }

  /* Profile content */
  .profile-content { padding: 16px; }

  /* Member hero */
  .member-hero { padding: 20px; flex-direction: row; gap: 16px; }
  .member-hero-avatar { width: 52px; height: 52px; font-size: 18px; }
  .member-hero-name { font-size: 18px; }

  /* Page card */
  .page-card { padding: 20px 16px; border-radius: 14px; }
  .page      { padding: 16px; }
  .card-title { font-size: 15px; }



  /* Info rows: stack key/value on narrow screens */
  .info-row { flex-direction: column; align-items: flex-start; gap: 4px; padding: 12px 0; }
  .info-val { text-align: left; font-size: 13px; }

  /* Financial cards: 2 columns on tablet, handled by auto-fill */
  .fin-cards-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .fin-card-amount { font-size: 16px; }

  /* Account bar: stack */
  .account-bar { flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; }
  .account-bar-balance { width: 100%; display: flex; justify-content: space-between; align-items: center; }
  .account-bar-balance-val { font-size: 18px; }

  /* Transaction detail panel: 2-col on tablet */
  .txn-detail-row { grid-template-columns: repeat(2, 1fr); }
  .txn-detail-body { padding: 0 16px; }
  .txn-detail-header { padding: 12px 16px; }

  /* Status: allow chip to wrap */
  .status-row { flex-wrap: wrap; gap: 8px; }

  /* Change password */
  .coming-card { padding: 40px 20px; }
  .coming-desc { max-width: 100%; }
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE — Mobile (≤ 640px)
═══════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .profile-tab { font-size: 11px; padding: 10px 12px; gap: 5px; }
  .profile-tab-icon { width: 13px; height: 13px; }
  .member-hero { flex-direction: column; align-items: flex-start; gap: 14px; padding: 18px; }
  .member-hero-name { font-size: 16px; }
  .member-hero-avatar { width: 48px; height: 48px; font-size: 16px; }
  .member-hero-meta { gap: 4px; }
  .info-grid { grid-template-columns: 1fr; gap: 14px 16px; }
  .fin-cards-grid { grid-template-columns: 1fr; }
  .info-row { padding: 10px 0; gap: 2px; }
  .account-bar-balance-val { font-size: 16px; }
  .fin-card-amount { font-size: 15px; }

  /* Transaction detail panel: 1-col on mobile */
  .txn-detail-row { grid-template-columns: 1fr 1fr; gap: 10px 14px; }
  .txn-detail-body { padding: 0 12px; }
  .txn-detail-group { padding: 12px 0; }
  .txn-detail-header { padding: 10px 12px; gap: 8px; }
  .txn-detail-ref { align-items: flex-start; }

  /* Responsive Table Stack */
  .txn-table-wrap { overflow: visible; border: none; background: transparent; box-shadow: none; }
  .txn-table, .txn-table tbody, .txn-table tr, .txn-table td { display: block; width: 100%; }
  .txn-table thead { display: none; }
  .txn-row { padding: 14px 16px; border: 1px solid #e8eaed; border-radius: 12px; background: #fff; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.02); }
  .txn-row.txn-row--open { border-bottom-left-radius: 0; border-bottom-right-radius: 0; margin-bottom: 0; border-bottom: none; }
  .txn-row:last-child { margin-bottom: 0; }
  .txn-row:hover { background: #fff; }
  .txn-table td:not(.txn-detail-cell) { 
    display: flex; justify-content: space-between; align-items: center; 
    padding: 8px 0; text-align: right; border-bottom: 1px solid #f3f4f6;
  }
  .txn-table td:not(.txn-detail-cell):last-child { border-bottom: none; padding-bottom: 0; }
  .txn-table td:not(.txn-detail-cell):first-child { padding-top: 0; }
  .txn-table td:not(.txn-detail-cell)::before { 
    content: attr(data-label); 
    font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;
  }
  
  /* Fix Action Cell on Mobile */
  .txn-action-cell { justify-content: flex-end !important; }
  .txn-action-cell::before { content: none !important; }
  
  /* Fix Detail Row on Mobile */
  .txn-detail-tr { margin-bottom: 12px; border: 1px solid #e8eaed; border-top: none; border-radius: 0 0 12px 12px; overflow: hidden; display: block; }
  .txn-detail-cell { display: block !important; padding: 0 !important; }
  .txn-detail-panel { margin: 0; border-left: none; border-top: 2px solid #e0e7ff; }
  .txn-detail-row { grid-template-columns: 1fr; gap: 12px; }
  .txn-detail-body { padding: 0 14px; }
  .txn-detail-group { padding: 14px 0; }
  .txn-detail-header { padding: 12px 14px; gap: 8px; flex-direction: column; align-items: flex-start; }
  .txn-detail-ref { align-items: flex-start; }
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE — Small mobile (≤ 400px)
═══════════════════════════════════════════════════════ */
@media (max-width: 400px) {
  .account-bar-balance-val { font-size: 14px; }
  .fin-card-amount { font-size: 14px; }

}

/* ═══════════════════════════════════════════════════════
   LOGOUT CONFIRMATION MODAL
═══════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px 28px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.modal-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  display: flex; align-items: center; justify-content: center;
  color: #ef4444;
  margin-bottom: 4px;
}
.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
.modal-desc {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.65;
  margin-bottom: 4px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
}
.modal-cancel {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.modal-cancel:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.modal-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-confirm {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 16px;
  border-radius: 10px;
  background: #ef4444;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.modal-confirm:hover:not(:disabled) { background: #dc2626; }
.modal-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card, .modal-fade-leave-to .modal-card { transform: scale(0.95) translateY(8px); }
</style>
