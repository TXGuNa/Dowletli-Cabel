import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { addSubmission } from '../content/submissionsStore';

export default function BookConsultation() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const services = [
    { id: 'technical', icon: '🛠️' },
    { id: 'sales', icon: '💼' },
    { id: 'tour', icon: '🏭' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const locale = i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'tkm' ? 'tk-TM' : 'en-US';
  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleString(locale, { weekday: 'short' }),
      date: d.getDate(),
      full: d.toISOString().split('T')[0],
    };
  });

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    addSubmission({
      type: 'booking',
      name: fullName.trim(),
      email: email.trim(),
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
    });
    setDone(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 container mx-auto px-6 bg-brand-bg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Panel */}
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-soft border border-brand-primary/15 text-brand-primary text-xs font-semibold mb-6">
              {t('booking.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-ink mb-5">{t('booking.title')}</h1>
            <p className="text-brand-text text-lg mb-10">{t('booking.subtitle')}</p>

            <div className="space-y-5">
              {[
                { title: t('booking.benefits.expertTitle'), desc: t('booking.benefits.expertDesc') },
                { title: t('booking.benefits.customTitle'), desc: t('booking.benefits.customDesc') },
              ].map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-primary shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-brand-ink font-bold">{b.title}</h4>
                    <p className="text-brand-text text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-card relative"
          >
            {done ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-soft text-brand-primary flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-brand-ink mb-2">{t('contact.form.success')}</h3>
                <p className="text-brand-text">
                  {selectedDate} · {selectedTime} · {t(`booking.services.${selectedService}`)}
                </p>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="flex justify-between mb-8 relative">
                  <div className="absolute top-4 left-0 right-0 h-[2px] bg-brand-border -z-0" />
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          step >= s ? 'bg-brand-primary text-white' : 'bg-white border border-brand-border text-brand-slate'
                        }`}
                      >
                        {s}
                      </div>
                      <span className="text-xs text-brand-slate hidden md:block">
                        {s === 1 ? t('booking.steps.service') : s === 2 ? t('booking.steps.datetime') : t('booking.steps.details')}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleConfirm}>
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-xl font-bold text-brand-ink mb-6">{t('booking.selectService')}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {services.map((srv) => (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedService(srv.id)}
                            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-4 ${
                              selectedService === srv.id
                                ? 'bg-brand-soft border-brand-primary'
                                : 'bg-white border-brand-border hover:border-brand-primary/40'
                            }`}
                          >
                            <span className="text-2xl">{srv.icon}</span>
                            <span className="text-brand-ink font-medium">{t(`booking.services.${srv.id}`)}</span>
                            <div
                              className={`ml-auto w-5 h-5 rounded-full border flex items-center justify-center ${
                                selectedService === srv.id ? 'border-brand-primary' : 'border-brand-slate/40'
                              }`}
                            >
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
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('booking.next')}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="mb-7">
                        <h3 className="text-brand-ink font-bold mb-4 flex items-center gap-2">
                          <CalendarIcon size={18} className="text-brand-primary" /> {t('booking.selectDate')}
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {dates.map((d) => (
                            <div
                              key={d.full}
                              onClick={() => setSelectedDate(d.full)}
                              className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                                selectedDate === d.full
                                  ? 'bg-brand-primary border-brand-primary text-white'
                                  : 'bg-white border-brand-border text-brand-text hover:border-brand-primary/40'
                              }`}
                            >
                              <div className="text-xs uppercase opacity-70 mb-1">{d.day}</div>
                              <div className="text-lg font-bold">{d.date}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-7">
                        <h3 className="text-brand-ink font-bold mb-4 flex items-center gap-2">
                          <Clock size={18} className="text-brand-primary" /> {t('booking.selectTime')}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {timeSlots.map((time) => (
                            <div
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`cursor-pointer py-2.5 px-4 rounded-xl border text-center font-medium transition-all ${
                                selectedTime === time
                                  ? 'bg-brand-soft border-brand-primary text-brand-primary'
                                  : 'bg-white border-brand-border text-brand-text hover:border-brand-primary/40'
                              }`}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center">
                        <button type="button" onClick={() => setStep(1)} className="text-brand-slate hover:text-brand-ink font-medium px-2">
                          {t('booking.back')}
                        </button>
                        <button
                          type="button"
                          disabled={!selectedDate || !selectedTime}
                          onClick={() => setStep(3)}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('booking.next')}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-xl font-bold text-brand-ink mb-6">{t('booking.yourInfo')}</h3>

                      <div className="bg-brand-soft p-4 rounded-xl border border-brand-border mb-6 flex items-center justify-between">
                        <div>
                          <div className="text-brand-slate text-xs uppercase tracking-wider mb-1">{t('booking.summary')}</div>
                          <div className="text-brand-ink font-medium">{selectedDate} · {selectedTime}</div>
                          <div className="text-brand-primary text-sm">{t(`booking.services.${selectedService}`)}</div>
                        </div>
                        <button type="button" onClick={() => setStep(1)} className="text-xs text-brand-slate underline hover:text-brand-ink">
                          {t('booking.edit')}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-brand-text text-sm font-medium mb-2">{t('booking.fullName')}</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-ink focus:border-brand-ink focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-brand-text text-sm font-medium mb-2">{t('booking.emailAddress')}</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-ink focus:border-brand-ink focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center">
                        <button type="button" onClick={() => setStep(2)} className="text-brand-slate hover:text-brand-ink font-medium px-2">
                          {t('booking.back')}
                        </button>
                        <button type="submit" className="btn-primary">
                          {t('booking.confirm')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
