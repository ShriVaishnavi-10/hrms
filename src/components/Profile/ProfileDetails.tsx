'use client'

import { useState, useRef } from 'react'
import { updateEmployeeProfile, updateEmployeeCertifications, updateEmployeeAttachments } from '@/app/employees/actions'
import { createClient as createBrowserClient } from '@/utils/supabase/client'
import { useToast } from '@/components/UI/Toast'
import { 
  User, 
  Briefcase, 
  FileText, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Award, 
  Layers,
  Upload,
  ChevronRight,
  ExternalLink,
  Plus,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Users as UsersIcon,
  Trash2,
  ShieldCheck
} from 'lucide-react'
import SimpleOrgChart from '@/components/OrgChart/SimpleOrgChart'

type TabType = 'personal' | 'professional' | 'documents' | 'admin'

export default function ProfileDetails({ 
  employee, 
  isAdmin,
  isSelf = false,
  allEmployees = [], 
  allDepartments = [] 
}: { 
  employee: any, 
  isAdmin: boolean,
  isSelf?: boolean,
  allEmployees?: any[],
  allDepartments?: any[]
}) {
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Career & Skills', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
  ]

  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Administration', icon: Shield })
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Convert form data to nested objects if necessary (skills, etc.)
    const updates: any = {}
    formData.forEach((value, key) => {
      if (key === 'skills') {
        updates[key] = (value as string).split(',').map(s => s.trim()).filter(Boolean)
      } else {
        updates[key] = value
      }
    })

    const result = await updateEmployeeProfile(employee.id, updates)
    if (result.success) {
      toast.success("Profile saved successfully!")
      setIsEditing(false)
    } else {
      toast.error(result.error || "Failed to update profile.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Edit Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/20 border border-border/50 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted hover:text-foreground hover:bg-card'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {(isAdmin || isSelf) && (
          <div className="flex items-center gap-3">
             <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isEditing 
                    ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                }`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden relative min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-10 h-10 text-primary animate-spin" />
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">Syncing Records...</p>
          </div>
        )}
        
        <div className="p-1">
          {activeTab === 'personal' && (
            <form onSubmit={handleSave}>
              <PersonalTab employee={employee} isEditing={isEditing} />
              {isEditing && (
                <div className="px-8 pb-8">
                   <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
                      Save Profile Changes
                   </button>
                </div>
              )}
            </form>
          )}
          {activeTab === 'professional' && <ProfessionalTab employee={employee} isEditing={isEditing} isAdmin={isAdmin} isSelf={isSelf} onSave={handleSave} />}
          {activeTab === 'documents' && <DocumentTab employee={employee} isEditing={isEditing} isAdmin={isAdmin} isSelf={isSelf} />}
          {activeTab === 'admin' && (
            <AdminTab 
              employee={employee} 
              isEditing={isEditing} 
              isAdmin={isAdmin}
              allEmployees={allEmployees}
              allDepartments={allDepartments}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PersonalTab({ employee, isEditing }: { employee: any, isEditing: boolean }) {
  return (
    <div className="p-8 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
             <Mail className="w-3.5 h-3.5" />
             Contact Information
          </h4>
          <DetailEditable label="Official Email" name="email" value={employee.email} isEditing={isEditing} placeholder="e.g., mail@company.com" />
          <DetailEditable label="Phone Number" name="phone" value={employee.phone} isEditing={isEditing} placeholder="e.g., +91 98765 43210" />
          <DetailEditable label="Residential Address" name="address" value={employee.address} isEditing={isEditing} textArea placeholder="Full address..." />
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
             <Calendar className="w-3.5 h-3.5" />
             Personal Details
          </h4>
          <DetailEditable label="Date of Birth" name="dob" type="date" value={employee.dob} isEditing={isEditing} />
          <DetailEditable label="Gender" name="gender" value={employee.gender} isEditing={isEditing} placeholder="Male / Female / Other" />
          <DetailEditable label="Marital Status" name="marital_status" value={employee.marital_status} isEditing={isEditing} placeholder="Single / Married" />
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
             <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
             Emergency Contacts
          </h4>
          <DetailEditable label="Contact Name" name="emergency_contact_name" value={employee.emergency_contact_name} isEditing={isEditing} placeholder="Full name" />
          <DetailEditable label="Relationship" name="emergency_contact_relation" value={employee.emergency_contact_relation} isEditing={isEditing} placeholder="e.g., Father, Spouse" />
          <DetailEditable label="Emergency Phone" name="emergency_contact_phone" value={employee.emergency_contact_phone} isEditing={isEditing} placeholder="Phone number" />
        </div>
      </div>
    </div>
  )
}

function ProfessionalTab({ 
  employee, 
  isEditing,
  isAdmin,
  isSelf,
  onSave 
}: { 
  employee: any, 
  isEditing: boolean,
  isAdmin: boolean,
  isSelf: boolean,
  onSave: (e: React.FormEvent<HTMLFormElement>) => void 
}) {
  const [isAddingCert, setIsAddingCert] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleAddCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const newCert = {
      title: fd.get('title'),
      issuer: fd.get('issuer'),
      date: fd.get('date'),
      url: fd.get('url')
    }

    const currentCerts = employee.certifications || []
    const updatedCerts = [...currentCerts, newCert]

    const result = await updateEmployeeCertifications(employee.id, updatedCerts)
    if (result.success) {
      toast.success("Certification added successfully.")
      setIsAddingCert(false)
    } else {
      toast.error(result.error || "Failed to add certificate.")
    }
    setLoading(false)
  }

  const handleDeleteCert = async (index: number) => {
    if (!confirm('Remove this certification?')) return
    setLoading(true)
    const updatedCerts = employee.certifications.filter((_: any, i: number) => i !== index)
    const result = await updateEmployeeCertifications(employee.id, updatedCerts)
    if (result.success) {
       toast.success("Certification removed.")
    } else {
       toast.error(result.error || "Delete failed.")
    }
    setLoading(false)
  }

  return (
    <div className="p-8 space-y-10 relative">
       {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
       )}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form onSubmit={onSave} className="space-y-6">
             <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <Layers className="w-3.5 h-3.5" />
                Skills Inventory
             </h4>
             {isEditing ? (
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest pl-1 italic">* Enter skills comma-separated</p>
                      <textarea 
                         name="skills" 
                         defaultValue={employee.skills?.join(', ')} 
                         className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none h-32"
                         placeholder="Next.js, Tailwind, TypeScript..."
                      />
                   </div>
                   <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:opacity-90">
                      Update Skills
                   </button>
                </div>
             ) : (
                <div className="flex flex-wrap gap-2">
                   {employee.skills?.length > 0 ? (
                     employee.skills.map((skill: string, idx: number) => (
                       <span key={idx} className="px-3 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-lg border border-primary/10 hover:bg-primary hover:text-white transition-all cursor-default">
                          {skill}
                       </span>
                     ))
                   ) : (
                     <p className="text-xs text-muted italic font-medium">No skills listed yet.</p>
                   )}
                </div>
             )}
          </form>

          <div className="space-y-6">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                   <Award className="w-3.5 h-3.5" />
                   Professional Certifications
                </h4>
                {(isAdmin || isSelf) && (
                   <button 
                     type="button" 
                     onClick={() => setIsAddingCert(!isAddingCert)}
                     className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     {isAddingCert ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                   </button>
                )}
             </div>

             {isAddingCert && (
                <form onSubmit={handleAddCert} className="bg-muted/5 border border-primary/20 rounded-2xl p-6 mb-6 space-y-4 animate-in zoom-in-95 duration-200">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-muted uppercase tracking-widest">Certificate Name</label>
                         <input name="title" required className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-muted uppercase tracking-widest">Issuing Body</label>
                         <input name="issuer" required className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-muted uppercase tracking-widest">Completion Date</label>
                         <input name="date" type="date" required className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-muted uppercase tracking-widest">Verification URL</label>
                         <input name="url" placeholder="https://..." className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      Confirm Add Certification
                   </button>
                </form>
             )}

             <div className="space-y-3">
                {employee.certifications?.length > 0 ? (
                  employee.certifications.map((cert: any, idx: number) => (
                    <div key={idx} className="group flex items-center justify-between p-4 bg-muted/5 border border-border/50 rounded-2xl hover:border-primary/20 transition-all">
                       <div className="space-y-1">
                          <p className="text-sm font-black text-foreground leading-tight tracking-tight">{cert.title || 'Untitled Certificate'}</p>
                          <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Issued by {cert.issuer || '--'}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          {cert.url && (
                             <a href={cert.url} target="_blank" rel="noreferrer" className="p-2 text-muted hover:text-primary"><ExternalLink className="w-4 h-4" /></a>
                          )}
                          {(isAdmin || isSelf) && (
                             <button 
                               type="button" 
                               onClick={() => handleDeleteCert(idx)}
                               className="p-2 opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic font-medium">No certifications recorded.</p>
                )}
             </div>
          </div>
       </div>
    </div>
  )
}

function DocumentTab({ 
  employee, 
  isEditing,
  isAdmin,
  isSelf 
}: { 
  employee: any, 
  isEditing: boolean,
  isAdmin: boolean,
  isSelf: boolean 
}) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const supabase = createBrowserClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const fileName = `${employee.id}/${Date.now()}-${file.name}`
    
    // 1. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (uploadError) {
      console.error('SUPABASE STORAGE UPLOAD ERROR:', uploadError)
      toast.error(`Upload failed: ${uploadError.message}. Ensure the "documents" bucket exists and RLS is enabled.`)
      setLoading(false)
      return
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    // 3. Save link to Profile Database
    const result = await updateEmployeeAttachments(employee.id, 'document', publicUrl, {
      name: file.name,
      size: file.size,
      path: fileName
    })

    if (result.success) {
      toast.success(`"${file.name}" uploaded successfully.`)
    } else {
      toast.error(result.error || "Failed to link document.")
    }
    
    setLoading(false)
  }

  return (
    <div className="p-8 space-y-8 relative">
       {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Securing your file...</p>
             </div>
          </div>
       )}
       
       <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-black text-foreground tracking-tight leading-tight">Digital Employee Records</h4>
            <p className="text-xs font-medium text-muted mt-1">Cloud-stored professional documents and IDs.</p>
          </div>

          {(isAdmin || isSelf) && (
            <>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={handleUpload} 
                 accept=".pdf,.doc,.docx,.jpg,.png"
               />
               <button 
                 type="button" 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex items-center gap-3 px-8 py-3 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-foreground/10"
               >
                  <Upload className="w-4 h-4" />
                  Upload Document
               </button>
            </>
          )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {employee.documents?.length > 0 ? (
            employee.documents.map((doc: any, idx: number) => (
              <a 
                key={idx} 
                href={doc.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col p-6 bg-muted/5 border border-border/50 rounded-3xl hover:border-primary/30 transition-all text-left"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                       <FileText className="w-6 h-6" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-all translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                 </div>
                 
                 <div className="space-y-1">
                    <p className="text-sm font-black text-foreground uppercase tracking-tight truncate leading-none mb-1">
                       {doc.name || 'Untitled Document'}
                    </p>
                    <div className="flex items-center gap-3">
                       <p className="text-[9px] font-bold text-muted uppercase tracking-widest italic">
                          Stored Cloud
                       </p>
                       <div className="w-1 h-1 bg-muted rounded-full"></div>
                       <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                          {doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'}
                       </p>
                    </div>
                 </div>
              </a>
            ))
          ) : (
             <div className="col-span-full py-20 flex flex-col items-center gap-4 border-2 border-dashed border-border rounded-3xl opacity-40">
                <div className="p-4 bg-muted/10 rounded-full">
                   <ShieldCheck className="w-10 h-10 text-muted" />
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest italic">No documents uploaded yet.</p>
             </div>
          )}
       </div>
    </div>
  )
}

function AdminTab({ 
  employee, 
  isEditing, 
  isAdmin,
  allEmployees, 
  allDepartments,
  onSave
}: { 
  employee: any, 
  isEditing: boolean, 
  isAdmin: boolean,
  allEmployees: any[], 
  allDepartments: any[],
  onSave: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSave} className="p-8 space-y-10">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <Shield className="w-3.5 h-3.5" />
                Organizational Hierarchy
             </h4>
             {isEditing ? (
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Assign Reporting Manager</label>
                   <select name="manager_id" defaultValue={employee.manager_id || 'none'} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option value="none">No Manager</option>
                      {allEmployees.filter(e => e.id !== employee.id).map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.designation})</option>
                      ))}
                   </select>
                </div>
             ) : (
                <>
                  <DetailEditable label="Reporting Manager" value={employee.manager?.full_name || 'No manager assigned'} isEditing={false} />
                  <DetailEditable label="Manager Designation" value={employee.manager?.designation || '--'} isEditing={false} />
                </>
             )}
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <Shield className="w-3.5 h-3.5" />
                Employment Status
             </h4>
             {isEditing ? (
                <>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Assign Department</label>
                      <select name="department" defaultValue={employee.department || 'none'} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none">
                         <option value="none">Unassigned</option>
                         {allDepartments.map(dept => (
                           <option key={dept.id} value={dept.name}>{dept.name}</option>
                         ))}
                      </select>
                   </div>
                   <DetailEditable label="Employee Designation" name="designation" value={employee.designation} isEditing={isEditing} />
                   <DetailEditable label="Cost Center" name="cost_center" value={employee.cost_center} isEditing={isEditing} />
                </>
             ) : (
               <>
                  <DetailEditable label="Department" value={employee.department || 'Not allocated'} isEditing={false} />
                  <DetailEditable label="Designation" value={employee.designation || 'Not specified'} isEditing={false} />
                  <DetailEditable label="Cost Center" value={employee.cost_center || 'Not allocated'} isEditing={false} />
                  
                  {/* Visal Org Chart */}
                  <div className="pt-8 border-t border-border mt-8">
                     <SimpleOrgChart employee={employee} manager={employee.manager} />
                  </div>
               </>
             )}
          </div>
       </div>

       {isEditing && (
         <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all mt-6">
            Save Admin Settings
         </button>
       )}
    </form>
  )
}

function DetailEditable({ 
  label, 
  name, 
  value, 
  isEditing, 
  type = "text", 
  placeholder = "", 
  textArea = false 
}: { 
  label: string, 
  name?: string, 
  value: string, 
  isEditing: boolean,
  type?: string,
  placeholder?: string,
  textArea?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-muted uppercase tracking-[0.1em]">{label}</p>
      {isEditing && name ? (
        textArea ? (
          <textarea 
            name={name} 
            defaultValue={value} 
            placeholder={placeholder}
            className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none min-h-[80px]"
          />
        ) : (
          <input 
            name={name} 
            type={type}
            defaultValue={value} 
            placeholder={placeholder}
            className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none"
          />
        )
      ) : (
        <p className="text-sm font-extrabold text-foreground tracking-tight">{value || 'Not provided'}</p>
      )}
    </div>
  )
}
