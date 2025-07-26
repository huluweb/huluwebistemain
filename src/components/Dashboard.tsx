"use client"
import React, { useEffect, useState } from 'react';
import { 
  HiUserGroup, 
  HiDocumentText, 
  HiUsers, 
  HiCalendar, 
  HiCheckCircle, 
  HiClock,
  HiArrowUp,
  HiArrowDown
} from 'react-icons/hi';
import Chart from './Chart'; // Assuming Chart component exists
import CalendarIcon from "@/components/CalanderIcon"
const Dashboard: React.FC = () => {
  // State for dashboard metrics
  const [employee, setEmployee] = useState(0);
  const [applicants, setApplicants] = useState(0);
  const [user, setUser] = useState(0);
  const [event, setEvent] = useState(0);
  const [task, setTaskCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([]); 
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log(data)
      setApplicants(data.applicants);
      setEmployee(data.employees);
      setUser(data.users);
      setEvent(data.events);
      setTaskCompleted(data.tasks.completed);
      setProgress(data.tasks.notCompleted);
      setTasks(data.eventsData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };
  useEffect(() => {
     fetchUpcoming();
   }, []);
 
   const fetchUpcoming = async () => {
     try {
       const response = await fetch('http://localhost:5000/api/notifications', {
         headers: {
           Authorization: `Bearer ${localStorage.getItem('token')}`,
         },
       });
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
       const data = await response.json();
       // Map backend data to frontend structure
       const mappedNotifications = data.map(notification => ({
         id: notification._id,
         title: notification.title,
         content: notification.discription, // Map 'discription' to 'content'
         read: notification.mark, // Map 'mark' to 'read'
         time: notification.time,
         type: notification.type || 'system', // Default to 'system' if type is not provided
         eventTime: notification.eventTime || null, // Include eventTime if available
       }));
       setNotifications(mappedNotifications);
     } catch (error) {
       console.error('Error fetching notifications:', error);
     }
   };
  // Dashboard card data
  const dashboardCards = [
    { title: "Employees", value: employee, icon: HiUserGroup, trend: "increase" },
    { title: "Applicants", value: applicants, icon: HiDocumentText, trend: "increase" },
    { title: "Users", value: user, icon: HiUsers, trend: "increase" },
    { title: "Events", value: event, icon: HiCalendar, trend: "increase" },
    { title: "Tasks Completed", value: task, icon: HiCheckCircle, trend: "increase" },
    { title: "Tasks Pending", value: progress, icon: HiClock, trend: "decrease" }
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Your key metrics and activities at a glance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <card.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  card.trend === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {card.trend === 'increase' ? (
                  <HiArrowUp className="mr-1 w-5 h-5" />
                ) : (
                  <HiArrowDown className="mr-1 w-5 h-5" />
                )}
                {card.trend === 'increase' ? 'Up' : 'Down'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="h-80">
          <Chart />
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
          {notifications.slice(0, 5).map((notification, index) => (
  <div key={notification._id} className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
    <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
      <HiUserGroup className="w-6 h-6" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-800">{notification.title}</p>
      <p className="text-xs text-gray-500">2 hours ago</p>
    </div>
  </div>
))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          {/* <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-bold">JUN</div>
                  <div className="text-lg font-bold">15</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">Team Meeting</p>
                  <p className="text-xs text-gray-500">10:00 AM - 11:30 AM</p>
                </div>
              </div>
            ))}
          </div> */}
          <div className="space-y-4">
            {tasks.map((item) => (
              <div key={item.date} className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center">
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
                <div className="ml-4 mt-2">
                  <p className="text-sm font-medium text-gray-800">Title: {item.title}</p>
                  <p className="text-sm font-medium text-gray-800">Date: {item.date}</p>
                  <p className="text-xs text-gray-500">Time :{item.time} AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;