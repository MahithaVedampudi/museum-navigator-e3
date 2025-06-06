"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Search,
  ZoomIn,
  ZoomOut,
  Volume2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Heart,
  StopCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Expanded collection of famous Indian artifacts
const artifacts = {
  "national museum → harappan civilization": {
    title: "Harappan Civilization Artifacts",
    artist: "Ancient Indus Valley Craftsmen",
    location: "National Museum, New Delhi",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "The Harappan Civilization, also known as the Indus Valley Civilization, flourished from 3300 to 1300 BCE. These artifacts showcase the advanced urban planning, sophisticated drainage systems, and remarkable craftsmanship of one of the world's earliest civilizations. The seals, pottery, and bronze figurines demonstrate their mastery in metallurgy and artistic expression.",
      kids: "Long, long ago, there were super smart people who lived near big rivers in India! They built amazing cities with proper roads and even toilets in every house - something many places didn't have even 100 years ago! They made beautiful pots, toys, and tiny stamps with pictures of animals on them.",
    },
    funFact: {
      adult: "The Harappan script remains undeciphered to this day, making it one of archaeology's greatest mysteries!",
      kids: "These ancient people had their own secret writing that no one can read even today - it's like the ultimate puzzle! 🧩",
    },
    year: "3300-1300 BCE",
    medium: "Bronze, Terracotta, Stone",
  },
  "indian museum → gandhara sculptures": {
    title: "Gandhara Sculptures",
    artist: "Gandhara School Artists",
    location: "Indian Museum, Kolkata",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "The Gandhara School of Art flourished from the 1st to 5th centuries CE in present-day Pakistan and Afghanistan. These sculptures beautifully blend Greco-Roman artistic techniques with Indian Buddhist themes, creating a unique Indo-Greek artistic style. The realistic portrayal of Buddha and Bodhisattvas shows strong Hellenistic influence.",
      kids: "Artists from different countries worked together to make these beautiful statues of Buddha! They mixed the art styles from Greece (far away!) with Indian ideas to create something totally new and amazing. It's like mixing different colors to make a brand new color!",
    },
    funFact: {
      adult:
        "Gandhara art was the first to depict Buddha in human form - earlier, he was only represented through symbols!",
      kids: "Before these artists, no one drew Buddha as a person - they only used symbols like footprints and wheels! 👣",
    },
    year: "1st-5th Century CE",
    medium: "Schist Stone, Stucco",
  },
  "prince of wales → chola bronzes": {
    title: "Chola Bronze Sculptures",
    artist: "Chola Dynasty Artisans",
    location: "Prince of Wales Museum, Mumbai",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "The Chola bronzes represent the pinnacle of South Indian bronze casting, created between the 9th and 13th centuries CE. These masterpieces, particularly the Nataraja (Dancing Shiva), showcase the lost-wax casting technique and embody the perfect fusion of spirituality, artistry, and metallurgical skill. Each sculpture captures divine energy in bronze.",
      kids: "The Chola kings had the most amazing artists who could make metal dance! They created beautiful statues of gods and goddesses that look so real, you might think they could start moving any moment. The most famous one shows Lord Shiva dancing in a circle of fire!",
    },
    funFact: {
      adult:
        "The Chola Nataraja is considered so perfect that it's displayed in CERN, Switzerland, as a symbol of cosmic dance!",
      kids: "One of these dancing Shiva statues is so famous that scientists in other countries keep it in their important building! 🕺",
    },
    year: "9th-13th Century CE",
    medium: "Bronze (Lost-wax casting)",
  },
}

// Wikipedia API functions with better error handling
const fetchWikipediaData = async (query: string) => {
  try {
    // First try to search for the page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query,
    )}&format=json&origin=*&srlimit=1`

    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (!searchData.query?.search?.length) {
      throw new Error("No search results found")
    }

    const pageTitle = searchData.query.search[0].title

    // Now get the page summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
    const summaryResponse = await fetch(summaryUrl)

    if (!summaryResponse.ok) {
      throw new Error("Summary not found")
    }

    const summaryData = await summaryResponse.json()

    return {
      title: summaryData.title,
      extract: summaryData.extract,
      description: summaryData.description,
      thumbnail: summaryData.thumbnail?.source,
      url: summaryData.content_urls?.desktop?.page,
      pageId: summaryData.pageid,
    }
  } catch (error) {
    console.error("Wikipedia API error:", error)
    return null
  }
}

const fetchMuseumCollections = async (museumName: string) => {
  try {
    // Try to fetch museum page
    const museumData = await fetchWikipediaData(museumName)
    if (!museumData) {
      // Fallback to a more generic search
      const fallbackData = await fetchWikipediaData(`${museumName} museum`)
      return fallbackData ? { museum: fallbackData, collections: null } : null
    }

    // Also try to fetch collections information with multiple search terms
    const collectionQueries = [`${museumName} collection`, `${museumName} artifacts`, `${museumName} exhibits`]

    let collectionsData = null
    for (const query of collectionQueries) {
      collectionsData = await fetchWikipediaData(query)
      if (collectionsData) break
    }

    return {
      museum: museumData,
      collections: collectionsData,
    }
  } catch (error) {
    console.error("Error fetching museum collections:", error)
    return null
  }
}

// Indian Museums with better Wikipedia search terms and fallback data
const indianMuseums = {
  "national museum": {
    name: "National Museum, New Delhi",
    wikiQuery: "National Museum New Delhi",
    fallbackInfo: {
      description: "India's premier museum showcasing the country's cultural heritage",
      established: "1949",
      highlights: "Harappan artifacts, Buddhist sculptures, Mughal paintings",
    },
    highlights: [
      "Harappan Civilization Gallery - Ancient Indus Valley artifacts",
      "Mauryan Gallery - Ashoka's edicts and sculptures",
      "Gupta Gallery - Golden age sculptures and coins",
      "Medieval Gallery - Mughal miniature paintings",
      "Decorative Arts - Textiles, jewelry, and crafts",
      "Central Asian Antiquities - Silk Route artifacts",
      "Manuscript Gallery - Ancient palm leaf manuscripts",
      "Numismatic Gallery - Ancient Indian coins",
    ],
  },
  "indian museum": {
    name: "Indian Museum, Kolkata",
    wikiQuery: "Indian Museum Kolkata",
    fallbackInfo: {
      description: "The oldest and largest museum in India, established in 1814",
      established: "1814",
      highlights: "Egyptian mummies, Buddhist sculptures, natural history specimens",
    },
    highlights: [
      "Archaeology Gallery - Gandhara and Mathura sculptures",
      "Art Gallery - Bengal School paintings",
      "Anthropology Section - Tribal artifacts from Northeast India",
      "Geology Gallery - Fossils and meteorites",
      "Zoology Gallery - Rare specimens and skeletons",
      "Botany Gallery - Herbarium and plant specimens",
      "Egyptian Gallery - Mummies and ancient artifacts",
      "Coin Gallery - Ancient Indian and foreign coins",
    ],
  },
  "prince of wales": {
    name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai",
    wikiQuery: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    fallbackInfo: {
      description: "Formerly Prince of Wales Museum, showcasing Indian art and culture",
      established: "1922",
      highlights: "Chola bronzes, Mughal miniatures, decorative arts",
    },
    highlights: [
      "Sculpture Gallery - Chola bronzes and stone sculptures",
      "Miniature Paintings - Mughal and Rajasthani art",
      "Decorative Arts - Jade, ivory, and metalwork",
      "Arms and Armour - Medieval Indian weapons",
      "Natural History - Dioramas and specimens",
      "Pre-Columbian Art - Ancient American artifacts",
      "European Art - Colonial period paintings",
      "Key Gallery - Special rotating exhibitions",
    ],
  },
  "salar jung": {
    name: "Salar Jung Museum, Hyderabad",
    wikiQuery: "Salar Jung Museum",
    fallbackInfo: {
      description: "One of India's three National Museums with the world's largest one-man collection",
      established: "1951",
      highlights: "Jade collection, manuscripts, European paintings, clocks",
    },
    highlights: [
      "Sculpture Gallery - Indian and European sculptures",
      "Manuscript Gallery - Quran and other religious texts",
      "Miniature Paintings - Persian and Indian schools",
      "Textiles Gallery - Rare fabrics and costumes",
      "Metal Gallery - Bidriware and bronze artifacts",
      "Ivory Gallery - Intricate carved pieces",
      "Jade Gallery - Mughal jade artifacts",
      "Clock Gallery - Antique timepieces from around the world",
    ],
  },
  "government museum": {
    name: "Government Museum, Chennai",
    wikiQuery: "Government Museum Chennai",
    fallbackInfo: {
      description: "Second oldest museum in India, famous for its bronze gallery",
      established: "1851",
      highlights: "Chola bronzes, South Indian sculptures, archaeological finds",
    },
    highlights: [
      "Bronze Gallery - Chola and Pallava bronzes",
      "Stone Sculpture Gallery - South Indian temple art",
      "Archaeology Gallery - Tamil Nadu excavations",
      "Numismatics Gallery - South Indian coins",
      "Anthropology Gallery - Tamil culture and traditions",
      "Botany Gallery - South Indian flora",
      "Geology Gallery - Tamil Nadu minerals and rocks",
      "Zoology Gallery - Regional fauna specimens",
    ],
  },
  "ajanta caves": {
    name: "Ajanta Caves, Maharashtra",
    wikiQuery: "Ajanta Caves",
    fallbackInfo: {
      description: "UNESCO World Heritage Site with ancient Buddhist cave paintings",
      established: "2nd century BCE - 6th century CE",
      highlights: "Buddhist frescoes, rock-cut architecture, ancient paintings",
    },
    highlights: [
      "Cave 1 - Bodhisattva Padmapani paintings",
      "Cave 2 - Jataka story murals",
      "Cave 16 - The Great Bodhisattva",
      "Cave 17 - Wheel of Life paintings",
      "Cave 19 - Chaitya hall with stupa",
      "Cave 26 - Parinirvana sculpture",
      "Cave 4 - Unfinished monastery",
      "Cave 10 - Oldest chaitya hall",
    ],
  },
}

export default function MuseumNavigator() {
  const [query, setQuery] = useState("")
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [isKidsMode, setIsKidsMode] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showMuseumMap, setShowMuseumMap] = useState(false)
  const [selectedMuseum, setSelectedMuseum] = useState(null)
  const [museumWikiData, setMuseumWikiData] = useState(null)
  const [isLoadingWiki, setIsLoadingWiki] = useState(false)
  const [wikiError, setWikiError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const imageRef = useRef(null)
  const audioIntervalRef = useRef(null)
  const audioStartTimeRef = useRef(null)
  const audioDurationRef = useRef(null)

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current)
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Reset audio when changing artifact or mode
  useEffect(() => {
    stopAudio()
  }, [selectedArtifact, isKidsMode])

  const handleSearch = (searchQuery: string) => {
    const normalizedQuery = searchQuery.toLowerCase().trim()
    const artifact = artifacts[normalizedQuery]

    if (artifact) {
      setSelectedArtifact(artifact)
      setZoomLevel(1)
      setShowFavorites(false)
      setShowMuseumMap(false)
    } else {
      // Show suggestion for partial matches
      const suggestions = Object.keys(artifacts).filter(
        (key) => key.includes(normalizedQuery) || normalizedQuery.includes(key.split(" → ")[1]?.split(" ")[0] || ""),
      )
      if (suggestions.length > 0) {
        setSelectedArtifact(artifacts[suggestions[0]])
        setZoomLevel(1)
        setShowFavorites(false)
        setShowMuseumMap(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showMuseumMap) {
        handleMuseumMapSearch(query)
      } else {
        handleSearch(query)
      }
    }
  }

  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      if (direction === "in" && prev < 3) return prev + 0.5
      if (direction === "out" && prev > 1) return prev - 0.5
      return prev
    })
  }

  const quickSearches = [
    "National Museum → Harappan Civilization",
    "Indian Museum → Gandhara Sculptures",
    "Prince of Wales → Chola Bronzes",
  ]

  const stopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setAudioProgress(0)
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current)
        audioIntervalRef.current = null
      }
    }
  }

  const handleAudioTour = () => {
    if (isPlaying) {
      stopAudio()
      return
    }

    if ("speechSynthesis" in window) {
      // Stop any previous audio
      window.speechSynthesis.cancel()

      // Get the text to read - combine backstory and fun fact
      const backstory = isKidsMode ? selectedArtifact.backstory.kids : selectedArtifact.backstory.adult
      const funFact = isKidsMode ? selectedArtifact.funFact.kids : selectedArtifact.funFact.adult
      const textToRead = `${backstory} ${funFact}`

      const utterance = new SpeechSynthesisUtterance(textToRead)
      utterance.rate = 0.9
      utterance.pitch = 1

      // Set up progress tracking
      audioDurationRef.current = textToRead.length * 50 // Rough estimate of duration based on text length
      audioStartTimeRef.current = Date.now()

      // Update progress bar
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current)
      }

      audioIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - audioStartTimeRef.current
        const progress = Math.min(100, (elapsed / audioDurationRef.current) * 100)
        setAudioProgress(progress)

        if (progress >= 100 || !window.speechSynthesis.speaking) {
          clearInterval(audioIntervalRef.current)
          audioIntervalRef.current = null
          setIsPlaying(false)
          setAudioProgress(0)
        }
      }, 100)

      // Handle audio end
      utterance.onend = () => {
        setIsPlaying(false)
        setAudioProgress(0)
        if (audioIntervalRef.current) {
          clearInterval(audioIntervalRef.current)
          audioIntervalRef.current = null
        }
      }

      // Start speaking
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    } else {
      alert("Audio tour not supported in this browser. Please try Chrome, Safari, or Edge.")
    }
  }

  const handleSaveToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("museumFavorites") || "[]")
    const artifactData = {
      id: selectedArtifact.title.toLowerCase().replace(/\s+/g, "-"),
      title: selectedArtifact.title,
      artist: selectedArtifact.artist,
      location: selectedArtifact.location,
      year: selectedArtifact.year,
    }

    const existingIndex = favorites.findIndex((fav) => fav.id === artifactData.id)
    if (existingIndex === -1) {
      favorites.push(artifactData)
      localStorage.setItem("museumFavorites", JSON.stringify(favorites))
      alert(`${selectedArtifact.title} saved to favorites!`)
    } else {
      alert(`${selectedArtifact.title} is already in your favorites!`)
    }
  }

  const handleMuseumMapSearch = async (museumQuery: string) => {
    const normalizedQuery = museumQuery.toLowerCase().trim()
    const museum = indianMuseums[normalizedQuery]

    if (museum) {
      setSelectedMuseum(museum)
      setShowMuseumMap(true)
      setSelectedArtifact(null)
      setShowFavorites(false)
      setWikiError(null)

      // Fetch Wikipedia data for the museum
      setIsLoadingWiki(true)
      try {
        const wikiData = await fetchMuseumCollections(museum.wikiQuery)
        setMuseumWikiData(wikiData)
        if (!wikiData) {
          setWikiError("Wikipedia information not available, showing local data")
        }
      } catch (error) {
        console.error("Error fetching Wikipedia data:", error)
        setMuseumWikiData(null)
        setWikiError("Failed to load Wikipedia data, showing local information")
      } finally {
        setIsLoadingWiki(false)
      }
    } else {
      // Try partial matching
      const suggestions = Object.keys(indianMuseums).filter(
        (key) => key.includes(normalizedQuery) || normalizedQuery.includes(key),
      )
      if (suggestions.length > 0) {
        const suggestedMuseum = indianMuseums[suggestions[0]]
        setSelectedMuseum(suggestedMuseum)
        setShowMuseumMap(true)
        setSelectedArtifact(null)
        setShowFavorites(false)
        setWikiError(null)

        // Fetch Wikipedia data for the suggested museum
        setIsLoadingWiki(true)
        try {
          const wikiData = await fetchMuseumCollections(suggestedMuseum.wikiQuery)
          setMuseumWikiData(wikiData)
          if (!wikiData) {
            setWikiError("Wikipedia information not available, showing local data")
          }
        } catch (error) {
          console.error("Error fetching Wikipedia data:", error)
          setMuseumWikiData(null)
          setWikiError("Failed to load Wikipedia data, showing local information")
        } finally {
          setIsLoadingWiki(false)
        }
      } else {
        alert(
          "Museum not found. Try: National Museum, Indian Museum, Prince of Wales, Salar Jung, Government Museum, or Ajanta Caves",
        )
      }
    }
  }

  const showFavoritesPage = () => {
    setShowFavorites(true)
    setSelectedArtifact(null)
    setShowMuseumMap(false)
  }

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem("museumFavorites") || "[]")
  }

  const removeFavorite = (id: string) => {
    const favorites = getFavorites().filter((fav) => fav.id !== id)
    localStorage.setItem("museumFavorites", JSON.stringify(favorites))
    setShowFavorites(true) // Refresh the view
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            3-Second Museum Navigator
          </h1>
          <p className="text-gray-600">Explore Indian Museums & Cultural Artifacts</p>
          <div className="text-sm text-orange-600 font-medium">
            ✨ Now featuring {Object.keys(artifacts).length} famous Indian artifacts with Wikipedia integration!
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant={!showFavorites && !showMuseumMap ? "default" : "outline"}
            onClick={() => {
              setShowFavorites(false)
              setShowMuseumMap(false)
              setSelectedArtifact(null)
            }}
          >
            🏺 Artifacts
          </Button>
          <Button variant={showFavorites ? "default" : "outline"} onClick={showFavoritesPage}>
            <Heart className="w-4 h-4 mr-2" />
            Favorites
          </Button>
          <Button
            variant={showMuseumMap ? "default" : "outline"}
            onClick={() => {
              setShowMuseumMap(true)
              setShowFavorites(false)
              setSelectedArtifact(null)
            }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Museum Guide
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={
                    showMuseumMap ? "e.g., National Museum" : "e.g., National Museum → Harappan Civilization"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 text-lg h-12"
                />
              </div>
              <Button
                onClick={() => (showMuseumMap ? handleMuseumMapSearch(query) : handleSearch(query))}
                size="lg"
                className="h-12"
                disabled={isLoadingWiki}
              >
                {isLoadingWiki ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : showMuseumMap ? (
                  "Find Museum"
                ) : (
                  "Navigate"
                )}
              </Button>
            </div>

            {/* Quick Search Buttons */}
            {!showMuseumMap && !showFavorites && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-500 mr-2">Quick searches:</span>
                {quickSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            )}

            {/* Museum Quick Searches */}
            {showMuseumMap && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-500 mr-2">Indian Museums:</span>
                {Object.keys(indianMuseums).map((museum) => (
                  <Button
                    key={museum}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(museum)
                      handleMuseumMapSearch(museum)
                    }}
                    className="text-xs"
                    disabled={isLoadingWiki}
                  >
                    {museum.replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites Page */}
        {showFavorites && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Your Favorite Artifacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getFavorites().length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💔</div>
                  <p className="text-gray-600">No favorites saved yet!</p>
                  <p className="text-sm text-gray-500 mt-2">Search for artifacts and save them to see them here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {getFavorites().map((favorite) => (
                    <div key={favorite.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{favorite.title}</h3>
                        <p className="text-sm text-gray-600">{favorite.artist}</p>
                        <p className="text-xs text-gray-500">
                          {favorite.location} • {favorite.year}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Museum Map with Wikipedia Integration */}
        {showMuseumMap && selectedMuseum && (
          <div className="space-y-6">
            {/* Loading State */}
            {isLoadingWiki && (
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Loading museum information from Wikipedia...</p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {wikiError && (
              <Card className="shadow-lg border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <ExternalLink className="w-4 h-4" />
                    <p className="text-sm">{wikiError}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Museum Information from Wikipedia */}
            {museumWikiData?.museum ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    {museumWikiData.museum.title}
                  </CardTitle>
                  {museumWikiData.museum.description && (
                    <p className="text-sm text-gray-600">{museumWikiData.museum.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {museumWikiData.museum.thumbnail && (
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={museumWikiData.museum.thumbnail || "/placeholder.svg"}
                          alt={museumWikiData.museum.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-2">About the Museum</h3>
                      <p className="text-gray-700 leading-relaxed">{museumWikiData.museum.extract}</p>
                    </div>
                    {museumWikiData.museum.url && (
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => window.open(museumWikiData.museum.url, "_blank")}
                          className="w-full"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read more on Wikipedia
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Fallback to local data when Wikipedia fails
              !isLoadingWiki && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-blue-500" />
                      {selectedMuseum.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{selectedMuseum.fallbackInfo.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Established:</span> {selectedMuseum.fallbackInfo.established}
                        </div>
                        <div>
                          <span className="font-medium">Key Highlights:</span> {selectedMuseum.fallbackInfo.highlights}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {/* Collections Information */}
            {museumWikiData?.collections && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Collections & Historical Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{museumWikiData.collections.extract}</p>
                  {museumWikiData.collections.url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(museumWikiData.collections.url, "_blank")}
                      className="mt-4"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn more about collections
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Museum Highlights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Must-Visit Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {selectedMuseum.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Badge variant="secondary" className="mt-1">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-blue-900">{highlight.split(" - ")[0]}</p>
                        {highlight.includes(" - ") && (
                          <p className="text-sm text-blue-700 mt-1">{highlight.split(" - ")[1]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        {selectedArtifact && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant={isKidsMode ? "default" : "outline"}
                onClick={() => setIsKidsMode(!isKidsMode)}
                className="flex items-center gap-2"
              >
                {isKidsMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                For Kids
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom("out")} disabled={zoomLevel <= 1}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => handleZoom("in")} disabled={zoomLevel >= 3}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {selectedArtifact && (
          <Card className={`shadow-lg border-2 ${isPlaying ? "border-green-400" : "border-blue-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <StopCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <Volume2 className="w-8 h-8 text-blue-500" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {isPlaying ? "Now Playing: Audio Tour" : "Listen to Audio Tour"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isPlaying ? "Click stop to end playback" : "Click play to hear the description read aloud"}
                  </p>
                  {isPlaying && (
                    <div className="mt-2">
                      <Progress value={audioProgress} className="h-2" />
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleAudioTour}
                  variant={isPlaying ? "destructive" : "default"}
                  size="lg"
                  className="min-w-[100px]"
                >
                  {isPlaying ? (
                    <>
                      <StopCircle className="w-4 h-4 mr-2" /> Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" /> Play
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {selectedArtifact && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Panel */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">🏺</div>
                    <p className="text-lg font-medium">{selectedArtifact.title}</p>
                    <p className="text-sm">{selectedArtifact.artist}</p>
                    <p className="text-xs mt-2">{selectedArtifact.year}</p>
                  </div>
                  {zoomLevel > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      <ZoomIn className="w-4 h-4 inline mr-1" />
                      {Math.round(zoomLevel * 100)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="space-y-6">
              {/* Title and Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedArtifact.title}</CardTitle>
                      <p className="text-lg text-gray-600 mt-1">{selectedArtifact.artist}</p>
                    </div>
                    <Badge variant="secondary">{selectedArtifact.year}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>{selectedArtifact.location}</span>
                    <span>•</span>
                    <span>{selectedArtifact.medium}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        📖 Backstory
                        {isKidsMode && (
                          <Badge variant="outline" className="text-xs">
                            Kid-Friendly
                          </Badge>
                        )}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {isKidsMode ? selectedArtifact.backstory.kids : selectedArtifact.backstory.adult}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">💡 Did You Know?</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {isKidsMode ? selectedArtifact.funFact.kids : selectedArtifact.funFact.adult}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={handleAudioTour}
                    >
                      {isPlaying ? (
                        <>
                          <StopCircle className="w-4 h-4 mr-2" /> Stop Audio
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" /> Audio Tour
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start" onClick={handleSaveToFavorites}>
                      <Heart className="w-4 h-4 mr-2" /> Save to Favorites
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!selectedArtifact && !showFavorites && !showMuseumMap && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🏛️</div>
                <h2 className="text-2xl font-semibold">Explore India's Cultural Treasures</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Discover {Object.keys(artifacts).length} famous Indian artifacts with detailed Wikipedia information
                  spanning over 5000 years of history!
                </p>
                <div className="text-sm text-gray-500">
                  From Harappan seals to Mughal miniatures - India's heritage awaits you
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">🏺</div>
                    <div className="font-medium">Ancient</div>
                    <div className="text-gray-600">Harappan, Mauryan</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="font-medium">Classical</div>
                    <div className="text-gray-600">Gupta, Chola</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">🕌</div>
                    <div className="font-medium">Medieval</div>
                    <div className="text-gray-600">Mughal, Sultanate</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl mb-2">🎭</div>
                    <div className="font-medium">Folk</div>
                    <div className="text-gray-600">Tribal, Regional</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
