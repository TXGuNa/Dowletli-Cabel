import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

export default function BookConsultation() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock Data
  const services = [
    { id: 'technical', icon: '🛠️' },
    { id: 'sales', icon: '💼' },
    { id: 'tour', icon: '🏭' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  // Generate next 7 days for calendar mock
  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return {
      day: d.toLocaleString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d.toISOString().split('T')[0]
    };
  });

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('contact.form.success'));
  };

  return (
    <div className="min-h-screen pt-28 pb-20 container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Panel: Value Prop */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-mono mb-6">
              SCHEDULE A MEETING
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('booking.title')}
            </h1>
            <p className="text-brand-slate text-lg mb-10">
              {t('booking.subtitle')}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-white/10 flex items-center justify-center text-brand-cyan shrink-0">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold">Expert Guidance</h4>
                    <p className="text-brand-slate text-sm">Direct access to our engineering team.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-white/10 flex items-center justify-center text-brand-cyan shrink-0">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold">Custom Solutions</h4>
                    <p className="text-brand-slate text-sm">Tailored manufacturing specs for your project.</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Booking Widget */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-surface border border-brand-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="flex justify-between mb-8 relative z-10">
               {[1, 2, 3].map((s) => (
                 <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${step >= s ? 'bg-brand-primary text-white' : 'bg-brand-navy border border-brand-white/10 text-brand-slate'}`}>
                      {s}
                    </div>
                    {s === 1 && <span className="text-xs text-brand-slate hidden md:block">Service</span>}
                    {s === 2 && <span className="text-xs text-brand-slate hidden md:block">Date & Time</span>}
                    {s === 3 && <span className="text-xs text-brand-slate hidden md:block">Details</span>}
                 </div>
               ))}
               {/* Line */}
               <div className="absolute top-4 left-0 right-0 h-[2px] bg-brand-white/5 -z-10" />
            </div>

            <form onSubmit={handleConfirm}>
              {/* Step 1: Select Service */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <h3 className="text-xl font-bold text-white mb-6">{t('booking.selectService')}</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {services.map((srv) => (
                        <div 
                          key={srv.id}
                          onClick={() => setSelectedService(srv.id)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-4 ${selectedService === srv.id ? 'bg-brand-primary/10 border-brand-primary' : 'bg-brand-navy border-brand-white/5 hover:border-brand-primary/50'}`}
                        >
                          <span className="text-2xl">{srv.icon}</span>
                          <span className="text-white font-medium">{t(`booking.services.${srv.id}`)}</span>
                          <div className={`ml-auto w-5 h-5 rounded-full border flex items-center justify-center ${selectedService === srv.id ? 'border-brand-primary' : 'border-brand-slate/30'}`}>
                             {selectedService === srv.id && <div className="w-3 h-3 rounded-full bg-brand-primary" />}
                          </div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 flex justify-end">
                      <button 
                        type="button"
                        disabled={!selectedService}
                        onClick={() => setStep(2)}
                        className="bg-brand-white text-brand-dark px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                      >
                        Next
                      </button>
                   </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <div className="mb-8">
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CalendarIcon size={18} className="text-brand-primary"/> {t('booking.selectDate')}</h3>
                     <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {dates.map((d) => (
                          <div 
                            key={d.full}
                            onClick={() => setSelectedDate(d.full)}
                            className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${selectedDate === d.full ? 'bg-brand-primary border-brand-primary text-white' : 'bg-brand-navy border-brand-white/5 text-brand-slate hover:border-brand-white/20'}`}
                          >
                            <div className="text-xs uppercase opacity-70 mb-1">{d.day}</div>
                            <div className="text-lg font-bold">{d.date}</div>
                          </div>
                        ))}
                     </div>
                   </div>

                   <div className="mb-8">
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-brand-primary"/> {t('booking.selectTime')}</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timeSlots.map((time) => (
                           <div
                             key={time}
                             onClick={() => setSelectedTime(time)}
                             className={`cursor-pointer py-2 px-4 rounded border text-center transition-all ${selectedTime === time ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-brand-navy border-brand-white/5 text-brand-slate hover:border-brand-white/20'}`}
                           >
                              {time}
                           </div>
                        ))}
                     </div>
                   </div>

                   <div className="mt-8 flex justify-between">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-brand-slate hover:text-white px-4"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(3)}
                        className="bg-brand-white text-brand-dark px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                      >
                        Next
                      </button>
                   </div>
                </motion.div>
              )}

              {/* Step 3: Details & Confirm */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <h3 className="text-xl font-bold text-white mb-6">{t('booking.yourInfo')}</h3>
                   
                   <div className="bg-brand-navy/50 p-4 rounded-lg border border-brand-white/5 mb-6 flex items-center justify-between">
                      <div>
                        <div className="text-brand-slate text-xs uppercase tracking-wider mb-1">Summary</div>
                        <div className="text-white font-medium">{selectedDate} at {selectedTime}</div>
                        <div className="text-brand-primary text-sm">{t(`booking.services.${selectedService}`)}</div>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="text-xs text-brand-slate underline hover:text-white">Edit</button>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <label className="block text-brand-slate text-sm mb-2">Full Name</label>
                         <input type="text" required className="w-full bg-brand-navy border border-brand-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none"/>
                      </div>
                      <div>
                         <label className="block text-brand-slate text-sm mb-2">Email Address</label>
                         <input type="email" required className="w-full bg-brand-navy border border-brand-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none"/>
                      </div>
                   </div>

                   <div className="mt-8 flex justify-between">
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-brand-slate hover:text-white px-4"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/25"
                      >
                        {t('booking.confirm')}
                      </button>
                   </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
