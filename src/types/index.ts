export interface Apartment {
  id:          string
  slug:        string
  title:       string
  description: string
  price:       number
  address:     string
  latitude:    number
  longitude:   number
  rooms:       number
  sizeSqm:     number
  images:      string[]  // parsed from JSON
  tags:        string[]  // parsed from JSON — e.g. ['balkong', 'hiss']
  status:        'draft' | 'published'
  listingType:   'rent' | 'sale' | 'kommande'
  propertyType:  string
  floor:         number | null
  fee:           number | null
  operatingCost: number | null
  buildYear:     number | null
  tenure:        string
  floorPlan:     string
  createdAt:     string
  updatedAt:     string
}

export interface Showing {
  id:          string
  apartmentId: string
  date:        string
  startTime:   string
  endTime:     string
  createdAt:   string
}

export interface Inquiry {
  id:              string
  slug:            string
  title:           string
  description:     string
  desiredLocation: string
  minSize:         number | null
  maxSize:         number | null
  minFee:          number | null
  maxFee:          number | null
  minRooms:        number | null
  maxRooms:        number | null
  desiredFloor:    string
  fireplaceReq:    boolean
  elevatorReq:     boolean
  terraceReq:      boolean
  patioReq:        boolean
  balconyReq:      boolean
  moveInFrom:      string
  moveInTo:        string
  status:          'draft' | 'published'
  createdAt:       string
  updatedAt:       string
}

export interface ApartmentFilters {
  search:      string
  listingType: string
  minPrice:    string
  maxPrice:    string
  minRooms:    string
  maxRooms:    string
  minSize:     string
  maxSize:     string
  features:    string
}
