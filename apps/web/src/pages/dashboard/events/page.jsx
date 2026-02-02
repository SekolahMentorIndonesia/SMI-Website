import UserLayout from "../../../layouts/UserLayout";
import UserGuard from "../../../components/dashboard/UserGuard";
import { Calendar, Video, Clock, MapPin, ArrowRight } from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Monthly Mentoring Session",
      date: "25 Jan 2026",
      time: "19:00 WIB",
      type: "Zoom Meeting",
      isLive: true
    },
    {
      id: 2,
      title: "Expert Sharing: High-Ticket Mentoring",
      date: "05 Feb 2026",
      time: "20:00 WIB",
      type: "Webinar",
      isLive: false
    }
  ];

  return (
    <UserGuard requireApproved={true}>
      <UserLayout>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Event / Zoom</h1>
            <p className="text-neutral-500 font-medium">Jangan lewatkan sesi live bersama mentor ahli.</p>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-neutral-500/5 transition-all group">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${event.isLive ? 'bg-brand-50 text-brand-600' : 'bg-neutral-50 text-neutral-400'}`}>
                    <Calendar className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Jan</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {event.isLive && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase">
                          <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
                          Live
                        </span>
                      )}
                      <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{event.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">{event.title}</h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                  <div className="flex flex-col items-center sm:items-start gap-1">
                    <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      Online
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
                    Dapatkan Link
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </UserLayout>
    </UserGuard>
  );
}
