/**
 * Staff Seed Script — Never Again AI Hackathon 2026
 * Creates 10 judges, 10 coordinators, 4 admins via Supabase Admin API.
 *
 * Run from the project root:
 *   node supabase/seed-staff.js
 *
 * Default password for all accounts: Staff@2026!
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL     = 'https://utwxmqhhxymgakmurwtg.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0d3htcWhoeHltZ2FrbXVyd3RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk1NjY4OCwiZXhwIjoyMDkwNTMyNjg4fQ.pyN6GTxWwR6SjidGO_j2UZ5vrRR3FrgGaI0ZvZzTzp0'
const DEFAULT_PASSWORD = 'Staff@2026!'

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const STAFF = [
  // Judges
  { email: 'dr.nkurunziza@hackathon.rw',   role: 'judge' },
  { email: 'prof.uwera@hackathon.rw',       role: 'judge' },
  { email: 'dr.bizimana.p@hackathon.rw',    role: 'judge' },
  { email: 'prof.mukamana@hackathon.rw',    role: 'judge' },
  { email: 'dr.ndayishimiye@hackathon.rw',  role: 'judge' },
  { email: 'prof.uwineza@hackathon.rw',     role: 'judge' },
  { email: 'dr.irakoze@hackathon.rw',       role: 'judge' },
  { email: 'prof.ineza@hackathon.rw',       role: 'judge' },
  { email: 'dr.nshimiyimana@hackathon.rw',  role: 'judge' },
  { email: 'prof.mukamurenzi@hackathon.rw', role: 'judge' },
  // Coordinators
  { email: 'coord.kayitesi@hackathon.rw',   role: 'coordinator' },
  { email: 'coord.ntwari@hackathon.rw',     role: 'coordinator' },
  { email: 'coord.uwase@hackathon.rw',      role: 'coordinator' },
  { email: 'coord.habimana@hackathon.rw',   role: 'coordinator' },
  { email: 'coord.ingabire@hackathon.rw',   role: 'coordinator' },
  { email: 'coord.hakizimana@hackathon.rw', role: 'coordinator' },
  { email: 'coord.umubyeyi@hackathon.rw',   role: 'coordinator' },
  { email: 'coord.mugisha@hackathon.rw',    role: 'coordinator' },
  { email: 'coord.uwimpuhwe@hackathon.rw',  role: 'coordinator' },
  { email: 'coord.niyonsaba@hackathon.rw',  role: 'coordinator' },
  // Admins
  { email: 'admin.akimana@hackathon.rw',    role: 'admin' },
  { email: 'admin.jules@hackathon.rw',      role: 'admin' },
  { email: 'admin.clarisse@hackathon.rw',   role: 'admin' },
  { email: 'admin.olivier@hackathon.rw',    role: 'admin' },
]

async function seedStaff() {
  console.log(`\nSeeding ${STAFF.length} staff accounts...\n`)
  let created = 0, skipped = 0, failed = 0

  for (const member of STAFF) {
    const { data, error: createErr } = await admin.auth.admin.createUser({
      email: member.email, password: DEFAULT_PASSWORD, email_confirm: true,
    })

    if (createErr) {
      if (createErr.message.includes('already been registered') || createErr.message.includes('already exists')) {
        console.log(`  SKIP  ${member.email}`)
        skipped++
      } else {
        console.error(`  FAIL  ${member.email} — ${createErr.message}`)
        failed++
      }
      continue
    }

    // Store role AND plaintext password so super admin can view credentials
    const { error: roleErr } = await admin
      .from('user_roles')
      .insert({ user_id: data.user.id, role: member.role, password_plain: DEFAULT_PASSWORD })

    if (roleErr) {
      console.error(`  ROLE  ${member.email} — ${roleErr.message}`)
      failed++
      continue
    }

    console.log(`  OK    [${member.role.padEnd(11)}]  ${member.email}`)
    created++
  }

  console.log(`\n──────────────────────────────────────`)
  console.log(`  Created : ${created}`)
  console.log(`  Skipped : ${skipped}  (already existed)`)
  console.log(`  Failed  : ${failed}`)
  console.log(`──────────────────────────────────────`)
  console.log(`  Default password: ${DEFAULT_PASSWORD}\n`)
}

seedStaff().catch(console.error)
