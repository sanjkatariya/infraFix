import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, MapPin, X } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function CitizenComplaint() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          alert('Unable to get location. Please select on map.')
        }
      )
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Mock submission
    setTimeout(() => {
      alert('Complaint submitted successfully!')
      navigate('/citizen/dashboard')
      setSubmitting(false)
    }, 1000)
    
    // Real implementation would be:
    // const formData = new FormData()
    // formData.append('description', description)
    // formData.append('image', image!)
    // formData.append('latitude', location!.lat.toString())
    // formData.append('longitude', location!.lng.toString())
    // await complaintsAPI.create(formData)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File a Complaint</h1>
        <p className="text-gray-600 mt-1">Report infrastructure issues in your area</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
            <CardDescription>Describe the issue you encountered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Describe the issue (e.g., large pothole on Main Street, broken streetlight, drainage problem...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Optional)
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full max-w-md rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    capture="environment"
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Specify where the issue is located</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={handleGetLocation}>
              <MapPin className="w-4 h-4 mr-2" />
              Use Current Location
            </Button>
            
            {location && (
              <div className="h-64 rounded-lg overflow-hidden border">
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.lat, location.lng]} />
                  <LocationPicker
                    onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                  />
                </MapContainer>
              </div>
            )}
            
            {!location && (
              <div className="h-64 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Click "Use Current Location" or select on map</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/citizen/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={!description || !location || submitting}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </div>
      </form>
    </div>
  )
}

