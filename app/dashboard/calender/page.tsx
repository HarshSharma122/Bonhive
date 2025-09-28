"use client";

import Button from "@/components/UI/button";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, ToolbarProps, View, Views, Event } from "react-big-calendar";
import { FiAlertCircle, FiChevronLeft, FiChevronRight, FiRefreshCw, FiCalendar } from "react-icons/fi";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type CalendarEventType = {
  userName: string;
  price: number;
  date: string;
  month: string;
  year: string;
  projectName: string;
  time: string;
  duration: string;
};

type CustomCalendarEvent = Event & {
  id: string;
  title: string;
  start: Date;
  end: Date;
  projectName: string;
  price: number;
  duration: string;
};

const Page = () => {
  const [calendarData, setCalendarData] = useState<CalendarEventType[]>([]);
  const [selectedView, setSelectedView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getCalendarData();
  }, []);

  const getCalendarData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await fetch("/api/calendar/fillcalendar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data: ${response.status}`);
      }

      const data = await response.json();
      setCalendarData(data.data || []);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setError("Failed to load calendar data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    getCalendarData(true);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setSelectedView(newView);
  };

  // Process events with proper error handling for date parsing
  const events: CustomCalendarEvent[] = calendarData.map((event, index) => {
    try {
      const startDate = new Date(`${event.year}-${event.month}-${event.date} ${event.time}`);
      
      // Calculate end date based on duration (assuming duration is in hours)
      const durationHours = parseInt(event.duration) || 1;
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + durationHours);

      return {
        id: `${index}-${event.userName}-${Date.now()}`,
        title: `${event.projectName} • ₹${event.price} • ${event.duration}h`,
        start: startDate,
        end: endDate,
        projectName: event.projectName,
        price: event.price,
        duration: event.duration,
      };
    } catch (error) {
      console.error("Error processing event:", error);
      // Return a fallback event for invalid dates
      return {
        id: `error-${index}`,
        title: `Invalid event data`,
        start: new Date(),
        end: new Date(),
        projectName: "Error",
        price: 0,
        duration: "0",
      };
    }
  }).filter(event => !isNaN(event.start.getTime()) && !isNaN(event.end.getTime()));

  const CustomToolbar = (toolbar: ToolbarProps<CustomCalendarEvent, object>) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
      setCurrentDate(new Date());
    };

    const viewButtons = [
      { view: Views.MONTH, label: "Month" },
      { view: Views.WEEK, label: "Week" },
      { view: Views.DAY, label: "Day" },
    ];

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-black text-white border-b border-gray-700 gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={goToBack}
              className="p-1 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex-shrink-0"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={goToCurrent}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
            >
              Today
            </button>
            <button 
              onClick={goToNext}
              className="p-1 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex-shrink-0"
              aria-label="Next"
            >
              <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <span className="text-base sm:text-lg font-bold ml-1 sm:ml-2 truncate max-w-[150px] sm:max-w-none">
            {toolbar.label}
          </span>
        </div>
        
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg w-full sm:w-auto justify-center">
          {viewButtons.map(({ view, label }) => (
            <button
              key={view}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-all duration-200 flex-1 sm:flex-none text-center ${
                toolbar.view === view 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => toolbar.onView(view)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const CustomEvent = (event: { event: CustomCalendarEvent }) => {
    return (
      <div className="p-1 text-xs w-full h-full overflow-hidden">
        <div className="font-semibold truncate leading-tight">{event.event.projectName}</div>
        <div className="flex justify-between text-gray-200 text-[10px] leading-tight mt-0.5">
          <span>₹{event.event.price}</span>
          <span>{event.event.duration}h</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <motion.div 
        className="w-full max-w-7xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <FiCalendar className="w-12 h-12 text-blue-500 mb-4" />
            <FiRefreshCw className="w-6 h-6 animate-spin text-blue-300 absolute -top-1 -right-1" />
          </div>
          <h2 className="text-xl font-semibold text-gray-50 mb-2">Loading Calendar</h2>
          <p className="text-gray-400">Getting your events ready...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-4 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4 px-3 sm:px-0">
          <div className="flex-1 w-full">
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-50 tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Calendar
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-2 text-sm md:text-base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Manage your projects & deadlines in one place
            </motion.p>
            
            {/* Stats */}
            {calendarData.length > 0 && (
              <motion.div 
                className="flex gap-3 mt-3 text-xs md:text-sm flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-gray-400">{events.length} events</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-gray-400">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex w-full lg:w-auto justify-start lg:justify-end">
            <button 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-all duration-200 rounded-lg border border-gray-600 hover:bg-gray-800 ${
                refreshing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            className="mb-6 mx-3 sm:mx-0 p-3 sm:p-4 bg-red-900/20 border border-red-800/50 text-red-200 rounded-xl flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FiAlertCircle className="text-lg flex-shrink-0" />
            <span className="flex-1 text-sm sm:text-base">{error}</span>
            <button 
              className="text-red-300 hover:text-red-100 text-lg font-bold transition-colors flex-shrink-0"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Calendar Section */}
        <motion.div
          className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-700 shadow-2xl bg-gray-900 text-white mx-3 sm:mx-0"
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ 
              height: "60vh", 
              minHeight: "500px",
              maxHeight: "800px"
            }}
            date={currentDate}
            onNavigate={handleNavigate}
            view={selectedView}
            onView={handleViewChange}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                padding: '1px 2px',
                fontSize: '11px',
                cursor: 'pointer',
                minHeight: '40px',
              },
            })}
            dayPropGetter={() => ({
              style: {
                borderRight: '1px solid #374151',
              },
            })}
            messages={{
              date: 'Date',
              time: 'Time',
              event: 'Event',
              allDay: 'All Day',
              week: 'Week',
              work_week: 'Work Week',
              day: 'Day',
              month: 'Month',
              previous: 'Back',
              next: 'Next',
              yesterday: 'Yesterday',
              tomorrow: 'Tomorrow',
              today: 'Today',
              agenda: 'Agenda',
              noEventsInRange: 'No events in this range.',
            }}
          />
        </motion.div>

        {/* Empty State */}
        {events.length === 0 && !loading && (
          <motion.div 
            className="text-center py-12 mx-3 sm:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FiCalendar className="w-14 h-14 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No events scheduled</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Your calendar is empty. Add some events to get started.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Page;