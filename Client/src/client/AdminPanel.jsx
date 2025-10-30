import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("channels");
  const [contacts, setContacts] = useState([]);
  const [trials, setTrials] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    categories: [],
    // ... other fields
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/channels", formData);
      alert("Channel added successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch contacts
  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/contacts?page=${page}&limit=10`);
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId, status) => {
    try {
      await api.patch(`/api/contacts/${contactId}`, { status });
      fetchContacts(currentPage); // Refresh the list
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await api.delete(`/api/contacts/${contactId}`);
        fetchContacts(currentPage); // Refresh the list
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  // Fetch trials
  const fetchTrials = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/trials?page=${page}&limit=10`);
      setTrials(response.data.trials);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching trials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscriptions
  const fetchSubscriptions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/subscriptions/admin?page=${page}&limit=10`
      );
      setSubscriptions(response.data.subscriptions);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update trial status
  const updateTrialStatus = async (trialId, status) => {
    try {
      await api.patch(`/api/trials/${trialId}`, { status });
      fetchTrials(currentPage); // Refresh the list
    } catch (error) {
      console.error("Error updating trial:", error);
    }
  };

  // Delete trial
  const deleteTrial = async (trialId) => {
    if (window.confirm("Are you sure you want to delete this trial?")) {
      try {
        await api.delete(`/api/trials/${trialId}`);
        fetchTrials(currentPage); // Refresh the list
      } catch (error) {
        console.error("Error deleting trial:", error);
      }
    }
  };

  // Fetch pricing plans
  const fetchPricingPlans = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pricing");
      setPricingPlans(response.data.plans);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update pricing plan
  const updatePricingPlan = async (planId, updates) => {
    try {
      await api.put(`/api/pricing/${planId}`, updates);
      fetchPricingPlans(); // Refresh the list
    } catch (error) {
      console.error("Error updating pricing plan:", error);
    }
  };

  // Toggle plan active status
  const togglePlanStatus = async (planId) => {
    try {
      await api.put(`/api/pricing/${planId}/toggle`);
      fetchPricingPlans(); // Refresh the list
    } catch (error) {
      console.error("Error toggling plan status:", error);
    }
  };

  // Set popular plan
  const setPopularPlan = async (planId, isPopular) => {
    try {
      await api.put(`/api/pricing/${planId}/popular`, { isPopular });
      fetchPricingPlans(); // Refresh the list
    } catch (error) {
      console.error("Error setting popular plan:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "contacts") {
      fetchContacts();
    } else if (activeTab === "trials") {
      fetchTrials();
    } else if (activeTab === "subscriptions") {
      fetchSubscriptions();
    } else if (activeTab === "pricing") {
      fetchPricingPlans();
    }
  }, [activeTab]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("channels")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "channels"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Channel Management
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "contacts"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Contact Submissions
        </button>
        <button
          onClick={() => setActiveTab("trials")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "trials"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Free Trials
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "subscriptions"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "pricing"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pricing
        </button>
      </div>

      {/* Channels Tab */}
      {activeTab === "channels" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Channel Management</h3>
          <form onSubmit={handleSubmit}>
            {/* Form fields matching your schema */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Channel
            </button>
          </form>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === "contacts" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Submissions</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading contacts...</p>
            </div>
          ) : (
            <>
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No contact submissions found.
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {contact.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {contact.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={contact.status}
                            onChange={(e) =>
                              updateContactStatus(contact._id, e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <button
                            onClick={() => deleteContact(contact._id)}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-700">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-6">
                      <button
                        onClick={() => fetchContacts(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => fetchContacts(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Trials Tab */}
      {activeTab === "trials" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Free Trial Registrations
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading trials...</p>
            </div>
          ) : (
            <>
              {trials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No trial registrations found.
                </div>
              ) : (
                <div className="space-y-4">
                  {trials.map((trial) => (
                    <div
                      key={trial._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {trial.name}
                          </h4>
                          <p className="text-sm text-gray-600">{trial.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(trial.createdAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Plan: {trial.plan} | Status: {trial.status}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={trial.status}
                            onChange={(e) =>
                              updateTrialStatus(trial._id, e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="converted">Converted</option>
                          </select>
                          <button
                            onClick={() => deleteTrial(trial._id)}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {trial.phone && (
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <p className="text-sm text-gray-700">
                            Phone: {trial.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-6">
                      <button
                        onClick={() => fetchTrials(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => fetchTrials(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Subscription Management
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading subscriptions...</p>
            </div>
          ) : (
            <>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No subscriptions found.
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div
                      key={subscription._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {subscription.userId?.name || "Unknown User"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {subscription.userId?.email || "No email"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Plan: {subscription.plan} | Status:{" "}
                            {subscription.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            Amount: ${subscription.amount} | Cycle:{" "}
                            {subscription.billingCycle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${subscription.amount}
                          </p>
                          <p className="text-xs text-gray-500">
                            {subscription.status}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Features:</strong>{" "}
                          {subscription.features.channels} channels,
                          {subscription.features.quality} quality,
                          {subscription.features.connections} connections
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-6">
                      <button
                        onClick={() => fetchSubscriptions(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => fetchSubscriptions(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Pricing Management</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading pricing plans...</p>
            </div>
          ) : (
            <>
              {pricingPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pricing plans found.
                </div>
              ) : (
                <div className="space-y-4">
                  {pricingPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {plan.name} ({plan.plan})
                          </h4>
                          <p className="text-sm text-gray-600">
                            {plan.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Monthly: ${plan.monthlyPrice} | Yearly: $
                            {plan.yearlyPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            Status: {plan.isActive ? "Active" : "Inactive"} |
                            Popular: {plan.isPopular ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => togglePlanStatus(plan.plan)}
                            className={`text-xs px-2 py-1 rounded ${
                              plan.isActive
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {plan.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() =>
                              setPopularPlan(plan.plan, !plan.isPopular)
                            }
                            className={`text-xs px-2 py-1 rounded ${
                              plan.isPopular
                                ? "bg-gray-500 text-white hover:bg-gray-600"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            {plan.isPopular ? "Remove Popular" : "Set Popular"}
                          </button>
                        </div>
                      </div>

                      {/* Quick Edit Form */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        <div>
                          <label className="text-xs text-gray-600">
                            Monthly Price
                          </label>
                          <input
                            type="number"
                            value={plan.monthlyPrice}
                            onChange={(e) =>
                              updatePricingPlan(plan.plan, {
                                monthlyPrice: parseFloat(e.target.value),
                              })
                            }
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">
                            Yearly Price
                          </label>
                          <input
                            type="number"
                            value={plan.yearlyPrice}
                            onChange={(e) =>
                              updatePricingPlan(plan.plan, {
                                yearlyPrice: parseFloat(e.target.value),
                              })
                            }
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">
                            Channels
                          </label>
                          <input
                            type="number"
                            value={plan.features.channels}
                            onChange={(e) =>
                              updatePricingPlan(plan.plan, {
                                "features.channels": parseInt(e.target.value),
                              })
                            }
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">
                            Connections
                          </label>
                          <input
                            type="number"
                            value={plan.features.connections}
                            onChange={(e) =>
                              updatePricingPlan(plan.plan, {
                                "features.connections": parseInt(
                                  e.target.value
                                ),
                              })
                            }
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
