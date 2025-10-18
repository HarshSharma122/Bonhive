"use client";

import moment from 'moment';
import { useCallback, useEffect, useState } from "react";
import { Event as BigCalendarEvent, Calendar, momentLocalizer, ToolbarProps, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiFolder,
  FiHome,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiWatch,
  FiX
} from "react-icons/fi";

const localizer = momentLocalizer(moment);

// Define proper TypeScript interfaces
interface CalendarResource {
  type: 'project' | 'meeting' | 'milestone' | 'event';
  status?: string;
  userName?: string;
  projectName?: string;
  duration?: string;
  price?: number;
  time?: string;
  date?: string;
  month?: string;
  year?: string;
}

interface CustomCalendarEvent extends BigCalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource?: CalendarResource;
}

// Interface for API response
interface ApiCalendarEvent {
  userName: string;
  date: string;
  month: string;
  year: string;
  time: string;
  projectName: string;
  duration: string;
  price: number;
}

// Event Modal Component
interface EventModalProps {
  event: CustomCalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (eventId: number) => void;
  onEdit?: (event: CustomCalendarEvent) => void;
}

const EventModal = ({ event, isOpen, onClose, onDelete, onEdit }: EventModalProps) => {
  if (!isOpen || !event) return null;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-indigo-100 text-indigo-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'milestone': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <FiFolder className="w-4 h-4" />;
      case 'meeting': return <FiUser className="w-4 h-4" />;
      case 'milestone': return <FiCalendar className="w-4 h-4" />;
      default: return <FiCalendar className="w-4 h-4" />;
    }
  };

  const eventType = event.resource?.type || 'event';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getEventTypeColor(eventType)}`}>
              {getEventTypeIcon(eventType)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(eventType)}`}>
                {eventType}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-gray-900">
                  {moment(event.start).format('MMM DD, YYYY')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium text-gray-900">
                  {moment(event.end).format('MMM DD, YYYY')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiClock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium text-gray-900">
                  {moment(event.start).format('h:mm A')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiClock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">End Time</p>
                <p className="font-medium text-gray-900">
                  {moment(event.end).format('h:mm A')}
                </p>
              </div>
            </div>

            {event.resource?.userName && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FiUser className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium text-gray-900">{event.resource.userName}</p>
                </div>
              </div>
            )}

            {event.resource?.duration && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <FiWatch className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{event.resource.duration}</p>
                </div>
              </div>
            )}

            {event.resource?.price && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <FiDollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">${event.resource.price}</p>
                </div>
              </div>
            )}
          </div>

          {event.resource?.projectName && event.resource.projectName !== event.title && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Project</p>
              <p className="font-medium text-gray-900">{event.resource.projectName}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Created {moment(event.start).fromNow()}
          </div>
          <div className="flex gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar Header Stats Component
interface CalendarStatsProps {
  events: CustomCalendarEvent[];
  filteredEvents: CustomCalendarEvent[];
  currentView: View;
}

const CalendarStats = ({ events, filteredEvents, currentView }: CalendarStatsProps) => {
  const getStats = () => {
    const today = new Date();
    const weekStart = moment().startOf('week').toDate();
    const weekEnd = moment().endOf('week').toDate();
    const monthStart = moment().startOf('month').toDate();
    const monthEnd = moment().endOf('month').toDate();

    const todayEvents = events.filter(event => 
      moment(event.start).isSame(today, 'day')
    );
    
    const weekEvents = events.filter(event => 
      moment(event.start).isBetween(weekStart, weekEnd, null, '[]')
    );
    
    const monthEvents = events.filter(event => 
      moment(event.start).isBetween(monthStart, monthEnd, null, '[]')
    );

    const eventTypes = events.reduce((acc, event) => {
      const type = event.resource?.type || 'event';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { todayEvents, weekEvents, monthEvents, eventTypes };
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <FiCalendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {filteredEvents.length} filtered
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-gray-900">{stats.todayEvents.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <FiClock className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {currentView === 'week' ? `${stats.weekEvents.length} this week` : `${stats.monthEvents.length} this month`}
        </p>
      </div>
    </div>
  );
};

// Event colors type
interface EventColors {
  bg: string;
  gradient: string;
}

type EventType = 'project' | 'meeting' | 'milestone' | 'event';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  const [events, setEvents] = useState<CustomCalendarEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomCalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Enhanced date parsing with better error handling
  const parseDate = (dateString: string, timeString?: string): Date => {
    let parsedDate: Date;

    // Try parsing as ISO string first
    if (dateString) {
      parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return applyTimeToDate(parsedDate, timeString);
      }
    }

    // Try parsing as different formats
    const formats = [
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'YYYY/MM/DD',
      'MMMM D, YYYY',
      'MMM D, YYYY'
    ];

    for (const format of formats) {
      const momentDate = moment(dateString, format);
      if (momentDate.isValid()) {
        return applyTimeToDate(momentDate.toDate(), timeString);
      }
    }

    // Fallback to current date
    console.warn('Invalid date format, using current date:', dateString);
    return applyTimeToDate(new Date(), timeString);
  };

  const applyTimeToDate = (date: Date, timeString?: string): Date => {
    if (!timeString) return date;

    const timeFormats = ['h:mm a', 'H:mm', 'HH:mm:ss', 'h:mm:ss a'];
    const momentTime = moment(timeString, timeFormats);
    
    if (momentTime.isValid()) {
      date.setHours(momentTime.hours());
      date.setMinutes(momentTime.minutes());
      date.setSeconds(momentTime.seconds());
    }
    
    return date;
  };

  // Enhanced data transformation
  const transformApiDataToEvents = (apiData: ApiCalendarEvent[]): CustomCalendarEvent[] => {
    return apiData.map((item, index) => {
      const startDate = parseDate(item.date, item.time);
      
      // Calculate end date based on duration or default to 1 hour
      let endDate = new Date(startDate);
      
      if (item.duration) {
        const durationMatch = item.duration.match(/(\d+)\s*hour/);
        if (durationMatch) {
          endDate.setHours(endDate.getHours() + parseInt(durationMatch[1]));
        } else {
          // Try to parse as end date
          const durationAsDate = parseDate(item.duration);
          if (!isNaN(durationAsDate.getTime())) {
            endDate = durationAsDate;
          } else {
            // Default to 1 hour
            endDate.setHours(endDate.getHours() + 1);
          }
        }
      } else {
        endDate.setHours(endDate.getHours() + 1);
      }

      // Ensure end date is after start date
      if (endDate <= startDate) {
        endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);
      }

      const eventType = determineEventType(item);

      const resource: CalendarResource = {
        type: eventType,
        status: 'upcoming',
        userName: item.userName,
        projectName: item.projectName,
        duration: item.duration,
        price: item.price,
        time: item.time,
        date: item.date,
        month: item.month,
        year: item.year
      };

      return {
        id: index + 1,
        title: item.projectName || `Event ${index + 1}`,
        start: startDate,
        end: endDate,
        resource
      };
    });
  };

  const determineEventType = (item: ApiCalendarEvent): EventType => {
    const projectName = item.projectName?.toLowerCase() || '';
    
    if (projectName.includes('meeting') || projectName.includes('call')) {
      return 'meeting';
    } else if (projectName.includes('milestone') || projectName.includes('deadline')) {
      return 'milestone';
    } else if (projectName.includes('project') || item.price > 0) {
      return 'project';
    }
    
    return 'event';
  };

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
      console.log('API Response:', data);
      
      const calendarEvents = transformApiDataToEvents(data.data || []);
      console.log('Transformed Events:', calendarEvents);
      
      setEvents(calendarEvents);
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

  // Enhanced filtering
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource?.projectName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || event.resource?.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // Event styling
  const eventStyleGetter = (event: CustomCalendarEvent) => {
    const colors: Record<EventType, EventColors> = {
      project: { bg: '#4f46e5', gradient: 'linear-gradient(135deg, #4f46e5, #3730a3)' },
      meeting: { bg: '#059669', gradient: 'linear-gradient(135deg, #059669, #047857)' },
      milestone: { bg: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)' },
      event: { bg: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }
    };

    const eventType: EventType = event.resource?.type || 'event';
    const color = colors[eventType];

    return {
      style: {
        background: color.gradient,
        border: 'none',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        padding: '2px 6px',
        fontSize: '11px',
        fontWeight: '500',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      }
    };
  };

  // Event handlers
  const handleSelectEvent = (event: CustomCalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    getCalendarData(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleEditEvent = (event: CustomCalendarEvent) => {
    // Implement edit functionality
    console.log('Edit event:', event);
    setIsModalOpen(false);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Custom toolbar with enhanced functionality
  interface CustomToolbarProps extends ToolbarProps<CustomCalendarEvent, object> {}
  
  const CustomToolbar = (toolbar: CustomToolbarProps) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const label = (): string => {
      const date = moment(toolbar.date);
      switch (toolbar.view) {
        case 'month':
          return date.format('MMMM YYYY');
        case 'week':
          return `Week of ${date.startOf('week').format('MMM D')}`;
        case 'day':
          return date.format('dddd, MMMM D, YYYY');
        default:
          return date.format('MMMM YYYY');
      }
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day', 'agenda'] as View[]).map((viewType) => (
              <button
                key={viewType}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  toolbar.view === viewType 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => toolbar.onView(viewType)}
              >
                {viewType}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <button
            onClick={goToBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToCurrent}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            Today
          </button>
          <button
            onClick={goToNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <span className="text-lg font-semibold text-gray-900">
            {label()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="py-4 lg:py-6">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  Calendar Dashboard
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Manage your schedule, projects & deadlines
                </p>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events, projects, users..."
                className="block w-full sm:w-64 pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-black focus:border-blue-500 bg-white shadow-sm transition-colors"
            >
              <option value="all">All Events</option>
              <option value="project">Projects</option>
              <option value="meeting">Meetings</option>
              <option value="milestone">Milestones</option>
              <option value="event">Other Events</option>
            </select>
            
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Calendar Stats */}
        <CalendarStats 
          events={events} 
          filteredEvents={filteredEvents}
          currentView={view}
        />

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-3">Loading calendar events...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCalendar className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => getCalendarData()}
                  className="text-red-800 hover:text-red-900 text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        {!loading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              onSelectEvent={handleSelectEvent}
              selectable
              view={view}
              views={['month', 'week', 'day', 'agenda']}
              onView={setView}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventStyleGetter}
              popup
              step={60}
              showMultiDayTimes
              defaultDate={new Date()}
              components={{
                toolbar: CustomToolbar
              }}
              messages={{
                next: "Next",
                previous: "Prev",
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                agenda: "Agenda",
                date: "Date",
                time: "Time",
                event: "Event",
                noEventsInRange: "No events in this range"
              }}
            />
          </div>
        )}

        {/* Events Summary */}
        {!loading && events.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 bg-white inline-block px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              Showing <span className="font-semibold text-blue-600">{filteredEvents.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{events.length}</span> events
              {filterType !== 'all' && (
                <span className="ml-2">
                  • Filtered by: <span className="font-semibold text-purple-600 capitalize">{filterType}</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Event Modal */}
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;