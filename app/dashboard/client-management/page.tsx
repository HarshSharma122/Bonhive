"use client";

import { ClientType } from "@/types/bonhive-types";
import { formatPrice } from "@/utilis/formatPrice";
import { useProfileStore } from "@/zustand/userProfileStore";
import { motion } from "framer-motion";
import {
  DollarSign,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  Star,
  Users,
  TrendingUp,
  Eye,
  Grid,
  List,
} from "lucide-react";
import { useEffect, useState } from "react";



const ClientDashboard = () => {
  const { user } = useProfileStore();
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
          setClientData(data.data);
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
              i < rating 
                ? "text-amber-400 fill-amber-400" 
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your clients and their projects efficiently
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search clients, projects, or emails..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
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

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-white shadow-sm text-blue-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-blue-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Clients</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {clientData.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Budget</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {user.userLanguage} {" "}
                  {formatPrice(
                    clientData.reduce((acc, client) => acc + client.clientBudget, 0)
                  ).toString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Avg. Rating</h3>
                <div className="flex items-center mt-1">
                  {renderRatingStars(
                    Math.round(
                      clientData.reduce((acc, client) => acc + client.rating, 0) /
                        clientData.length
                    ) || 0
                  )}
                  <span className="ml-2 text-gray-900 font-bold">
                    {(
                      clientData.reduce((acc, client) => acc + client.rating, 0) /
                        clientData.length || 0
                    ).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Star size={20} className="text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Active Projects</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {clientData.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClients.map((client, index) => (
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                          {client.projectName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {client.clientName}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        {renderRatingStars(client.rating)}
                      </div>
                      <div className="text-sm font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {user.userLanguage} {formatPrice(client.clientBudget).toString()}
                      </div>
                    </div>

                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-3 text-gray-400" />
                        <span className="truncate">{client.location || "Remote"}</span>
                      </div>

                      {client.contact && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-3 text-gray-400" />
                          <span>{client.contact}</span>
                        </div>
                      )}

                      {client.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-3 text-gray-400" />
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
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-left text-gray-600 font-semibold text-sm">Client</th>
                    <th className="pb-4 text-left text-gray-600 font-semibold text-sm">Project</th>
                    <th className="pb-4 text-left text-gray-600 font-semibold text-sm">Budget</th>
                    <th className="pb-4 text-left text-gray-600 font-semibold text-sm">Rating</th>
                    <th className="pb-4 text-left text-gray-600 font-semibold text-sm">Contact</th>
                    <th className="pb-4 text-left text-gray-600 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {client.clientName}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin size={12} className="mr-1" />
                            {client.location || "Remote"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-gray-900 font-medium">{client.projectName}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <DollarSign
                            size={14}
                            className="text-gray-500 mr-2"
                          />
                          <span className="text-gray-900 font-semibold">
                            {user.userLanguage} {formatPrice(client.clientBudget).toString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          {renderRatingStars(client.rating)}
                          <span className="text-sm text-gray-600">
                            ({client.rating}/5)
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col space-y-1">
                          {client.contact && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone size={12} className="mr-2" />
                              <span>{client.contact}</span>
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail size={12} className="mr-2" />
                              <span className="truncate max-w-[160px]">
                                {client.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3 text-lg">No clients found</div>
              <p className="text-gray-500 text-sm">
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