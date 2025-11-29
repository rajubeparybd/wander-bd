const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const getAllPackages = async (req, res) => {
    try {
        const { packagesCollection } = getCollections();
        const packages = await packagesCollection.find().toArray();
        res.send(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getPackageById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid package ID format" });
        }

        const { packagesCollection } = getCollections();
        const pkg = await packagesCollection.findOne({ _id: new ObjectId(id) });

        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }

        res.send(pkg);
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).send({ message: "Server error fetching package" });
    }
};

const addPackage = async (req, res) => {
    try {
        const packageData = req.body;
        const { packagesCollection } = getCollections();

        const result = await packagesCollection.insertOne(packageData);
        res.send(result);
    } catch (error) {
        console.error("Error adding package:", error);
        res.status(500).send({ message: "Server error" });
    }
};

// Coordinate mapping for Bangladesh destinations
const destinationCoordinates = {
    "cox's bazar": { latitude: 21.4272, longitude: 92.0058 },
    "dhaka": { latitude: 23.8103, longitude: 90.4125 },
    "bandarban": { latitude: 21.8311, longitude: 92.3686 },
    "srimangal": { latitude: 24.3065, longitude: 91.7296 },
    "sundarbans": { latitude: 21.9497, longitude: 89.1833 },
    "sylhet": { latitude: 24.8949, longitude: 91.8687 },
    "chittagong": { latitude: 22.3569, longitude: 91.7832 },
    "rangamati": { latitude: 22.7324, longitude: 92.2985 },
    "khagrachari": { latitude: 23.1193, longitude: 91.9847 },
    "kuakata": { latitude: 21.8166, longitude: 90.1166 },
    "sajek": { latitude: 23.3817, longitude: 92.2938 },
    "saint martin": { latitude: 20.6265, longitude: 92.3231 },
    "paharpur": { latitude: 25.0281, longitude: 88.9764 },
    "mahasthangarh": { latitude: 24.9612, longitude: 89.3458 },
    "ratargul": { latitude: 25.0138, longitude: 91.9450 },
    "jaflong": { latitude: 25.1726, longitude: 92.0008 },
    "tanguar haor": { latitude: 25.1167, longitude: 91.0500 }
};

const getDestinations = async (req, res) => {
    try {
        const { packagesCollection, bookingsCollection } = getCollections();
        
        // Get all packages and group by location
        const packages = await packagesCollection.find().toArray();
        
        // Get all bookings with "Accepted" or "In Review" status
        const bookings = await bookingsCollection.find({
            status: { $in: ["Accepted", "In Review"] }
        }).toArray();
        
        // Create a map to store location data
        const locationMap = new Map();
        
        // Process packages to get unique locations
        packages.forEach(pkg => {
            if (pkg.location) {
                const location = pkg.location;
                const locationKey = location.toLowerCase();
                
                if (!locationMap.has(locationKey)) {
                    const coords = destinationCoordinates[locationKey] || { 
                        latitude: 23.685, 
                        longitude: 90.3563 
                    };
                    
                    locationMap.set(locationKey, {
                        district: location,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        covered_area: [],
                        travelers: 0,
                        packageCount: 0
                    });
                }
                
                const locData = locationMap.get(locationKey);
                locData.packageCount++;
            }
        });
        
        // Count travelers per location from bookings
        bookings.forEach(booking => {
            // Get location from package
            const pkg = packages.find(p => p._id.toString() === booking.packageId);
            if (pkg && pkg.location) {
                const locationKey = pkg.location.toLowerCase();
                const locData = locationMap.get(locationKey);
                if (locData) {
                    locData.travelers += booking.numberOfPeople || 1;
                }
            }
        });
        
        // Convert map to array and sort by travelers count
        let destinations = Array.from(locationMap.values())
            .map(loc => ({
                ...loc,
                travelers: loc.travelers > 0 ? `${(loc.travelers / 1000).toFixed(1)}k+` : "0"
            }))
            .sort((a, b) => {
                const aCount = parseFloat(a.travelers) || 0;
                const bCount = parseFloat(b.travelers) || 0;
                return bCount - aCount;
            });
        
        // Limit to 5 destinations
        const limit = parseInt(req.query.limit) || 5;
        destinations = destinations.slice(0, limit);
        
        res.send(destinations);
    } catch (error) {
        console.error("Error fetching destinations:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid package ID format" });
        }

        const { packagesCollection } = getCollections();
        
        const result = await packagesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Package not found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid package ID format" });
        }

        const { packagesCollection } = getCollections();
        
        const result = await packagesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Package not found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    getAllPackages,
    getPackageById,
    addPackage,
    updatePackage,
    deletePackage,
    getDestinations
};
