"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useCallback, useEffect, useState } from "react";

import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  View,
  Views
} from "react-big-calendar";
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import { CalendarEventType, CustomCalendarEvent, EventType, EventTypeConfig, ViewButton } from "@/types/bonhive-types";
import { useProfileStore } from "@/zustand/userProfileStore";

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

// Type definitions


// Event type configuration
const eventTypes: EventTypeConfig[] = [
  { 
    value: "meeting", 
    label: "Meetings", 
    color: "bg-blue-500", 
    border: "border-l-blue-500", 
    bg: "bg-blue-50", 
    text: "text-blue-700" 
  },
  { 
    value: "deadline", 
    label: "Deadlines", 
    color: "bg-red-500", 
    border: "border-l-red-500", 
    bg: "bg-red-50", 
    text: "text-red-700" 
  },
  { 
    value: "milestone", 
    label: "Milestones", 
    color: "bg-green-500", 
    border: "border-l-green-500", 
    bg: "bg-green-50", 
    text: "text-green-700" 
  },
  { 
    value: "task", 
    label: "Tasks", 
    color: "bg-purple-500", 
    border: "border-l-purple-500", 
    bg: "bg-purple-50", 
    text: "text-purple-700" 
  },
];

// View buttons configuration
const viewButtons: ViewButton[] = [
  { view: Views.MONTH, label: "Month", icon: FiGrid },
  { view: Views.WEEK, label: "Week", icon: FiList },
  { view: Views.DAY, label: "Day", icon: FiClock },
];

const Calender = () => {
  const [calendarData, setCalendarData] = useState<CalendarEventType[]>([]);
  const [selectedView, setSelectedView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useProfileStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTypes] = useState<EventType[]>([]);

 const getEventType = useCallback((projectName: string): EventType => {
  const name = projectName.toLowerCase();
  if (name.includes("meeting") || name.includes("call")) return "meeting" as EventType;
  if (name.includes("deadline") || name.includes("due")) return "deadline" as EventType;
  if (name.includes("milestone") || name.includes("launch")) return "milestone" as EventType;
  return "task" as EventType;
}, []);

  const getCalendarData = useCallback(async (isRefresh = false) => {
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
  }, []);

  useEffect(() => {
    getCalendarData();
  }, [getCalendarData]);

  const handleRefresh = useCallback(() => {
    getCalendarData(true);
  }, [getCalendarData]);

  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setSelectedView(newView);
  }, []);

 // Process events with proper error handling for date parsing
const events: CustomCalendarEvent[] = calendarData
  .map((event, index): CustomCalendarEvent => {
    try {
      const startDate = new Date(
        `${event.year}-${event.month}-${event.date} ${event.time}`
      );

      // Calculate end date based on duration (assuming duration is in hours)
      const durationHours = parseInt(event.duration) || 1;
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + durationHours);

      const eventType: EventType = getEventType(event.projectName);

      return {
        id: `${index}-${event.userName}-${Date.now()}`,
        title: `${event.projectName} • ${user?.userLanguage || ''} ${event.price} • ${event.duration}h`,
        start: startDate,
        end: endDate,
        projectName: event.projectName,
        price: event.price,
        duration: event.duration,
        type: eventType,
        resource: null, // Add this if needed by react-big-calendar
      };
    } catch (error) {
      console.error("Error processing event:", error);
      return {
        id: `error-${index}`,
        title: `Invalid event data`,
        start: new Date(),
        end: new Date(),
        projectName: "Error",
        price: 0,
        duration: "0",
        type: "task", // This is now properly typed as EventType
        resource: null,
      };
    }
  })
  .filter(
    (event) => !isNaN(event.start.getTime()) && !isNaN(event.end.getTime())
  );

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type);
    return matchesSearch && matchesType;
  });

  interface CustomToolbarProps extends ToolbarProps<CustomCalendarEvent, object> {}

  const CustomToolbar = (toolbar: CustomToolbarProps) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
      setCurrentDate(new Date());
    };

    return (
      <div className="flex flex-col lg:flex-row items-center justify-between p-4 lg:p-6 bg-white border-b border-gray-200 gap-4">
        {/* Left Section - Navigation */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goToBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={goToCurrent}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-700 font-medium"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300"
              aria-label="Next"
            >
              <FiChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <span className="text-lg font-bold text-gray-900 ml-2 lg:ml-4">
            {toolbar.label}
          </span>
        </div>

        {/* Right Section - View Buttons */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full lg:w-auto justify-center">
          {viewButtons.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              className={`px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center gap-2 flex-1 lg:flex-initial justify-center ${
                toolbar.view === view
                  ? "bg-white text-blue-600 shadow-sm border border-gray-300"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => toolbar.onView(view)}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  interface CustomEventProps {
    event: CustomCalendarEvent;
  }

  const CustomEvent = ({ event }: CustomEventProps) => {
    const eventType = eventTypes.find(type => type.value === event.type);
    
    return (
      <div className={`p-2 text-xs w-full h-full overflow-hidden rounded-lg border-l-4 ${eventType?.border || 'border-l-gray-400'} bg-white shadow-sm hover:shadow-md transition-all duration-200 m-1`}>
        <div className="font-semibold truncate leading-tight text-gray-900 mb-1">
          {event.projectName}
        </div>
        <div className="flex justify-between text-gray-600 text-[10px] leading-tight">
          <span>
            {user?.userLanguage} {event.price}
          </span>
          <span>{event.duration}h</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiCalendar className="w-8 h-8 text-white" />
            </div>
            <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600 absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Calendar
          </h2>
          <p className="text-gray-600">Getting your events ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 min-h-screen bg-white">
      <div className="py-4 lg:py-6">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <FiCalendar className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  Calendar
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Manage your projects & deadlines in one place
                </p>
              </div>
            </div>

            {/* Stats */}
            {calendarData.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 font-medium">{filteredEvents.length} events</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <FiClock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <FiAlertCircle className="text-lg flex-shrink-0" />
            <span className="flex-1 text-sm">{error}</span>
            <button
              className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors flex-shrink-0 p-1"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Calendar Section */}
        <div className="rounded-xl overflow-hidden border border-gray-300 bg-white shadow-sm">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "65vh",
              minHeight: "500px",
            }}
            date={currentDate}
            onNavigate={handleNavigate}
            view={selectedView}
            onView={handleViewChange}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            eventPropGetter={() => {
              return {
                style: {
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  color: "#1f2937",
                  padding: "0",
                  fontSize: "11px",
                  cursor: "pointer",
                  minHeight: "50px",
                  margin: "2px",
                },
              };
            }}
            dayPropGetter={() => ({
              style: {
                borderRight: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
              },
            })}
            messages={{
              date: "Date",
              time: "Time",
              event: "Event",
              allDay: "All Day",
              week: "Week",
              work_week: "Work Week",
              day: "Day",
              month: "Month",
              previous: "Back",
              next: "Next",
              yesterday: "Yesterday",
              tomorrow: "Tomorrow",
              today: "Today",
              agenda: "Agenda",
              noEventsInRange: "No events in this range.",
            }}
          />
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || selectedTypes.length > 0 ? "No matching events found" : "No events scheduled"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm">
              {searchTerm || selectedTypes.length > 0 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first event."}
            </p>
            <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-200 font-medium text-sm">
              Create Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calender;