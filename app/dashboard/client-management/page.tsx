"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";

interface ClientType {
  clientName: string;
  userId: string;
  clientBudget: number;
  projectName: string;
  email: string;
  contact: string;
  location: string;
  notes: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string;
}

const ClientDashboard = () => {
  const [clientData, setClientData] = useState<ClientType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const getClients = async () => {
      await fetch("/api/client", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setClientData(data.data)
        });
      };
      getClients();
    }, []);
  // Filter clients based on search and rating filter
  const filteredClients = clientData?.filter((client) => {
    const matchesSearch =
      client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = filterRating ? client.rating === filterRating : true;

    return matchesSearch && matchesRating;
  });

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating ? "text-amber-400 fill-amber-400" : "text-gray-500"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Client Management</h1>
            <p className="text-gray-400 mt-1">
              Manage your clients and their projects
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search clients or projects..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-gray-700 border-none rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
                value={filterRating || ""}
                onChange={(e) =>
                  setFilterRating(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex bg-gray-700 p-1 rounded-lg">
              <button
                className={`p-2 rounded-md ₹{viewMode === 'grid' ? 'bg-gray-600 shadow-sm' : ''}`}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </button>
              <button
                className={`p-2 rounded-md ₹{viewMode === 'list' ? 'bg-gray-600 shadow-sm' : ''}`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-400 text-sm">Total Clients</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {clientData.length}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-400 text-sm">Total Budget</h3>
            <p className="text-2xl font-bold text-white mt-1">
              ₹
              {clientData
                .reduce((acc, client) => acc + client.clientBudget, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-400 text-sm">Avg. Rating</h3>
            <div className="flex items-center mt-1">
              {renderRatingStars(
                Math.round(
                  clientData.reduce((acc, client) => acc + client.rating, 0) /
                    clientData.length
                ) || 0
              )}
              <span className="ml-2 text-white">
                {(
                  clientData.reduce((acc, client) => acc + client.rating, 0) /
                    clientData.length || 0
                ).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-400 text-sm">Active Projects</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {clientData.length}
            </p>
          </div>
        </div>

        {/* Clients Section */}
        <motion.div
          className="bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredClients.map((client, index) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={index}
                  className="bg-gray-700 rounded-xl shadow-sm border border-gray-600 overflow-hidden transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-white line-clamp-1">
                          {client.projectName}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {client.clientName}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        {renderRatingStars(client.rating)}
                      </div>
                      <div className="text-sm font-medium px-2.5 py-1 rounded-full bg-blue-900/30 text-blue-300">
                        ₹{client.clientBudget.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-600">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin size={14} className="mr-2" />
                        <span>{client.location || "Remote"}</span>
                      </div>

                      {client.contact && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Phone size={14} className="mr-2" />
                          <span>{client.contact}</span>
                        </div>
                      )}

                      {client.email && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Mail size={14} className="mr-2" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-left text-gray-400">Client</th>
                    <th className="pb-3 text-left text-gray-400">Project</th>
                    <th className="pb-3 text-left text-gray-400">Budget</th>
                    <th className="pb-3 text-left text-gray-400">Rating</th>
                    <th className="pb-3 text-left text-gray-400">Contact</th>
                    <th className="pb-3 text-left text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-gray-700/50"
                    >
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {client.clientName}
                          </p>
                          <p className="text-sm text-gray-400">
                            {client.location || "Remote"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-white">{client.projectName}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <DollarSign
                            size={14}
                            className="text-gray-500 mr-1"
                          />
                          <span className="text-white">
                            {client.clientBudget.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        {renderRatingStars(client.rating)}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          {client.contact && (
                            <span className="text-sm text-gray-400">
                              {client.contact}
                            </span>
                          )}
                          {client.email && (
                            <span className="text-sm text-gray-400 truncate max-w-[160px]">
                              {client.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <button className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No clients found</div>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
