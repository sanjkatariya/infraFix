/**
 * In-memory database for InfraFix
 * In production, replace this with a real database (MongoDB, PostgreSQL, etc.)
 */

// In-memory storage
const database = {
  complaints: [],
  workorders: [],
  crew: [],
  inventory: [],
  resources: [],
  users: [],
  analytics: {
    stats: {
      totalComplaints: 0,
      activeWorkorders: 0,
      completedWorkorders: 0,
      crewMembers: 0,
      inventoryItems: 0,
    },
    trends: [],
    categories: {},
  },
};

// Helper functions
export const db = {
  // Complaints
  complaints: {
    findAll: () => database.complaints,
    findById: (id) => database.complaints.find(c => c.id === id),
    findByUserId: (userId) => database.complaints.filter(c => c.userId === userId),
    create: (complaint) => {
      const newComplaint = {
        ...complaint,
        id: complaint.id || `CPL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: complaint.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      database.complaints.push(newComplaint);
      return newComplaint;
    },
    update: (id, updates) => {
      const index = database.complaints.findIndex(c => c.id === id);
      if (index === -1) return null;
      database.complaints[index] = {
        ...database.complaints[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return database.complaints[index];
    },
    delete: (id) => {
      const index = database.complaints.findIndex(c => c.id === id);
      if (index === -1) return false;
      database.complaints.splice(index, 1);
      return true;
    },
  },

  // Workorders
  workorders: {
    findAll: () => database.workorders,
    findById: (id) => database.workorders.find(w => w.id === id),
    findByComplaintId: (complaintId) => database.workorders.filter(w => w.complaintId === complaintId),
    create: (workorder) => {
      const newWorkorder = {
        ...workorder,
        id: workorder.id || `WO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: workorder.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      database.workorders.push(newWorkorder);
      return newWorkorder;
    },
    update: (id, updates) => {
      const index = database.workorders.findIndex(w => w.id === id);
      if (index === -1) return null;
      database.workorders[index] = {
        ...database.workorders[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return database.workorders[index];
    },
    delete: (id) => {
      const index = database.workorders.findIndex(w => w.id === id);
      if (index === -1) return false;
      database.workorders.splice(index, 1);
      return true;
    },
  },

  // Crew
  crew: {
    findAll: () => database.crew,
    findById: (id) => database.crew.find(c => c.id === id),
    findByStatus: (status) => database.crew.filter(c => c.status === status),
    create: (member) => {
      const newMember = {
        ...member,
        id: member.id || `CREW-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: member.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      database.crew.push(newMember);
      return newMember;
    },
    update: (id, updates) => {
      const index = database.crew.findIndex(c => c.id === id);
      if (index === -1) return null;
      database.crew[index] = {
        ...database.crew[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return database.crew[index];
    },
    delete: (id) => {
      const index = database.crew.findIndex(c => c.id === id);
      if (index === -1) return false;
      database.crew.splice(index, 1);
      return true;
    },
  },

  // Inventory
  inventory: {
    findAll: () => database.inventory,
    findById: (id) => database.inventory.find(i => i.id === id),
    findByCategory: (category) => database.inventory.filter(i => i.category === category),
    create: (item) => {
      const newItem = {
        ...item,
        id: item.id || `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      database.inventory.push(newItem);
      return newItem;
    },
    update: (id, updates) => {
      const index = database.inventory.findIndex(i => i.id === id);
      if (index === -1) return null;
      database.inventory[index] = {
        ...database.inventory[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return database.inventory[index];
    },
    delete: (id) => {
      const index = database.inventory.findIndex(i => i.id === id);
      if (index === -1) return false;
      database.inventory.splice(index, 1);
      return true;
    },
  },

  // Resources
  resources: {
    findAll: () => database.resources,
    findById: (id) => database.resources.find(r => r.id === id),
    findByType: (type) => database.resources.filter(r => r.type === type),
    create: (resource) => {
      const newResource = {
        ...resource,
        id: resource.id || `RES-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: resource.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      database.resources.push(newResource);
      return newResource;
    },
    update: (id, updates) => {
      const index = database.resources.findIndex(r => r.id === id);
      if (index === -1) return null;
      database.resources[index] = {
        ...database.resources[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return database.resources[index];
    },
    delete: (id) => {
      const index = database.resources.findIndex(r => r.id === id);
      if (index === -1) return false;
      database.resources.splice(index, 1);
      return true;
    },
  },

  // Analytics
  analytics: {
    getStats: () => {
      const stats = {
        totalComplaints: database.complaints.length,
        activeWorkorders: database.workorders.filter(w => w.status !== 'completed').length,
        completedWorkorders: database.workorders.filter(w => w.status === 'completed').length,
        crewMembers: database.crew.length,
        inventoryItems: database.inventory.reduce((sum, item) => sum + (item.quantity || 0), 0),
        pendingComplaints: database.complaints.filter(c => c.status === 'pending').length,
        inProgressComplaints: database.complaints.filter(c => c.status === 'in-progress').length,
        resolvedComplaints: database.complaints.filter(c => c.status === 'resolved').length,
      };
      return stats;
    },
    getCategoryStats: () => {
      const categories = {};
      database.complaints.forEach(complaint => {
        const category = complaint.category || 'other';
        categories[category] = (categories[category] || 0) + 1;
      });
      return categories;
    },
    getTrends: (days = 7) => {
      // Generate trends for last N days
      const trends = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const complaintsCount = database.complaints.filter(c => {
          const complaintDate = new Date(c.createdAt).toISOString().split('T')[0];
          return complaintDate === dateStr;
        }).length;
        trends.push({
          date: dateStr,
          complaints: complaintsCount,
        });
      }
      return trends;
    },
  },
};

export default database;

