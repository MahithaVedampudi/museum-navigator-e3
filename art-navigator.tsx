"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, ZoomIn, ZoomOut, Volume2, ToggleLeft, ToggleRight, MapPin, Heart, StopCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Expanded collection of famous Indian artifacts
const artworks = {
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
  "national museum → ashoka pillar": {
    title: "Ashoka Pillar Capital",
    artist: "Mauryan Imperial Craftsmen",
    location: "National Museum, New Delhi",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "The Lion Capital of Ashoka from Sarnath, dating to 250 BCE, is one of India's most iconic sculptures. Created during Emperor Ashoka's reign, it originally crowned a pillar marking the spot where Buddha first taught. The four lions symbolize power, courage, pride, and confidence, while the wheel below represents dharma (righteousness). This masterpiece became India's national emblem.",
      kids: "Emperor Ashoka was like a super king who ruled almost all of India! He made these tall stone pillars with lions on top to tell people about being kind and good. The four lions look in all four directions to protect everyone. It's so special that it became India's symbol - you can see it on money and government buildings!",
    },
    funFact: {
      adult: "The original pillar was 50 feet tall, and the lions were carved from a single piece of sandstone!",
      kids: "The whole pillar was as tall as a 5-story building, and those four lions were carved from one giant rock! 🦁",
    },
    year: "250 BCE",
    medium: "Chunar Sandstone",
  },
  "ajanta caves → bodhisattva padmapani": {
    title: "Bodhisattva Padmapani Fresco",
    artist: "Buddhist Monk Artists",
    location: "Ajanta Caves, Maharashtra",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "The Bodhisattva Padmapani from Cave 1 at Ajanta, painted around 5th-6th century CE, is considered one of the finest examples of ancient Indian painting. This compassionate figure holds a lotus and represents the ideal of selfless service. The painting technique uses natural pigments and demonstrates sophisticated understanding of light, shadow, and human emotion, influencing art across Asia.",
      kids: "In caves carved into a mountain, ancient artists painted beautiful pictures on the walls! This painting shows a kind person called Bodhisattva who helps everyone. The artists used colors made from rocks and plants to paint, and even after 1500 years, the colors are still bright and beautiful!",
    },
    funFact: {
      adult:
        "The Ajanta paintings were lost for over 1000 years until a British officer rediscovered them while hunting in 1819!",
      kids: "These amazing paintings were hidden in the jungle for 1000 years until someone found them by accident while hunting! 🎨",
    },
    year: "5th-6th Century CE",
    medium: "Natural pigments on rock",
  },
  "government museum → tanjore painting": {
    title: "Tanjore Paintings",
    artist: "Thanjavur Court Artists",
    location: "Government Museum, Chennai",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Tanjore paintings originated in the 16th century in Thanjavur, Tamil Nadu, under the patronage of the Maratha rulers. These paintings are characterized by rich colors, surface richness, compact composition, and use of gold foil. They typically depict Hindu gods and goddesses, with Krishna being a popular subject. The technique involves multiple layers and semi-precious stones for embellishment.",
      kids: "Artists in Tamil Nadu created these super shiny paintings covered in real gold! They painted gods and goddesses with bright colors and stuck tiny gems and gold pieces on them. The paintings look like they're glowing because of all the gold and jewels. Lord Krishna is painted a lot because everyone loved his stories!",
    },
    funFact: {
      adult:
        "Authentic Tanjore paintings use 22-carat gold foil and semi-precious stones, making them literally priceless!",
      kids: "These paintings have real gold and precious stones stuck on them - they're like treasure paintings! ✨",
    },
    year: "16th-18th Century CE",
    medium: "Gold foil, gems on wood",
  },
  "salar jung → tipu sultan sword": {
    title: "Tipu Sultan's Sword",
    artist: "Mysore Royal Armourers",
    location: "Salar Jung Museum, Hyderabad",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "This ornate sword belonged to Tipu Sultan, the 'Tiger of Mysore,' who ruled from 1782-1799. The blade is made of wootz steel (Damascus steel), famous for its strength and distinctive watered pattern. The hilt is decorated with gold and precious stones, and bears inscriptions in Persian. Tipu Sultan was known for his fierce resistance against British colonialism and his innovative military tactics.",
      kids: "This beautiful sword belonged to a brave king called Tipu Sultan, who was known as the 'Tiger of Mysore' because he was so brave! The sword is made of super strong steel and decorated with gold and jewels. Tipu Sultan used swords like this to protect his kingdom from people who wanted to take it over.",
    },
    funFact: {
      adult:
        "Tipu Sultan's swords were so prized that they were taken as trophies by the British and are now in museums worldwide!",
      kids: "Tipu Sultan's swords were so famous that people from other countries wanted to keep them as special treasures! ⚔️",
    },
    year: "18th Century CE",
    medium: "Wootz steel, gold, precious stones",
  },
  "national museum → mughal miniature": {
    title: "Mughal Miniature Paintings",
    artist: "Mughal Court Artists",
    location: "National Museum, New Delhi",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Mughal miniature paintings flourished from the 16th to 18th centuries, combining Persian, Indian, and European influences. These detailed paintings were created for illuminated manuscripts and albums, depicting court scenes, battles, hunting expeditions, and portraits of emperors. Artists used fine brushes made from squirrel hair and natural pigments including gold and lapis lazuli.",
      kids: "The Mughal emperors loved tiny, detailed paintings that told stories! Artists used super thin brushes (made from squirrel hair!) to paint pictures smaller than this page. They painted kings, battles, animals, and gardens with colors so bright they seemed to glow. It took months to finish just one small painting!",
    },
    funFact: {
      adult: "Some Mughal miniatures contain over 100 figures in a painting smaller than a modern tablet screen!",
      kids: "Artists could fit more than 100 people in a painting smaller than an iPad - that's like drawing your whole school! 🎨",
    },
    year: "16th-18th Century CE",
    medium: "Natural pigments on paper",
  },
  "indian museum → mathura sculpture": {
    title: "Mathura School Sculptures",
    artist: "Mathura School Artists",
    location: "Indian Museum, Kolkata",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "The Mathura School of Art, flourishing from 1st to 12th centuries CE, represents the indigenous Indian tradition of sculpture. Unlike Gandhara art, Mathura sculptures are purely Indian in conception, carved from red sandstone. They depict Buddha, Jain Tirthankaras, and Hindu deities with distinctive features like heavy eyelids, thick lips, and robust physiques, establishing the classical Indian aesthetic.",
      kids: "Artists in the city of Mathura created statues that looked completely Indian! They used red stone from nearby and made statues of Buddha, Jain teachers, and Hindu gods. These statues have a special Indian look with peaceful faces and strong bodies. They showed the world what Indian art really looked like!",
    },
    funFact: {
      adult:
        "Mathura was the first place in India to create standing Buddha statues, influencing Buddhist art across Asia!",
      kids: "Mathura artists were the first in India to make statues of Buddha standing up, and this idea spread to many other countries! 🧘‍♂️",
    },
    year: "1st-12th Century CE",
    medium: "Red Sandstone",
  },
  "prince of wales → warli paintings": {
    title: "Warli Tribal Paintings",
    artist: "Warli Tribal Artists",
    location: "Prince of Wales Museum, Mumbai",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Warli painting is a traditional art form of the Warli tribe from Maharashtra, dating back to 2500 BCE. These paintings use simple geometric shapes - circles, triangles, and lines - to depict daily life, festivals, and nature. Traditionally painted on mud walls with rice paste, they represent one of the oldest art traditions in India, emphasizing harmony between humans and nature.",
      kids: "The Warli people are a tribe who live in the forests of Maharashtra. They paint simple but beautiful pictures using only circles, triangles, and lines! They paint about their daily life - dancing, farming, animals, and trees. They use white paint made from rice on brown mud walls. It's like drawing stick figures, but much more beautiful!",
    },
    funFact: {
      adult:
        "Warli art was almost unknown outside the tribe until the 1970s and is now recognized globally as a unique art form!",
      kids: "For thousands of years, only the Warli people knew about this art, but now people all over the world love it! 🎭",
    },
    year: "2500 BCE - Present",
    medium: "Rice paste on mud walls",
  },
  "government museum → pallava sculpture": {
    title: "Pallava Stone Sculptures",
    artist: "Pallava Dynasty Artisans",
    location: "Government Museum, Chennai",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Pallava sculptures from the 7th-9th centuries CE represent the golden age of South Indian art. Found in temples at Mahabalipuram and Kanchipuram, these sculptures showcase the transition from rock-cut to structural temple architecture. The famous Descent of the Ganges relief at Mahabalipuram is considered one of the largest and most intricate bas-reliefs in the world.",
      kids: "The Pallava kings were amazing builders who carved entire temples out of solid rock! They made huge sculptures showing stories from Hindu mythology. The most famous one shows the holy river Ganga coming down from heaven to earth, with gods, people, animals, and even elephants all carved on one giant rock!",
    },
    funFact: {
      adult:
        "The Shore Temple at Mahabalipuram, built by the Pallavas, is a UNESCO World Heritage Site and one of the oldest stone temples in South India!",
      kids: "The Pallava temples are so special that the whole world protects them as treasures for everyone to see! 🏛️",
    },
    year: "7th-9th Century CE",
    medium: "Granite Stone",
  },
  "national museum → kushan coins": {
    title: "Kushan Gold Coins",
    artist: "Kushan Imperial Mints",
    location: "National Museum, New Delhi",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Kushan gold coins from the 1st-4th centuries CE represent some of the finest numismatic art in ancient India. These coins feature portraits of Kushan emperors like Kanishka and Huvishka, along with various deities from Greek, Roman, Persian, and Indian pantheons. The coins demonstrate the cosmopolitan nature of the Kushan Empire and their role in Silk Road trade.",
      kids: "The Kushan kings made beautiful gold coins with their faces on them! These coins also had pictures of gods from many different countries - Greek gods, Persian gods, and Indian gods all together. This shows that the Kushan kingdom was like a big melting pot where people from many places lived and traded together!",
    },
    funFact: {
      adult:
        "Kushan coins are among the first in India to show realistic portraits of rulers, influencing coin design for centuries!",
      kids: "These were some of the first coins in India to show what the kings really looked like, not just symbols! 🪙",
    },
    year: "1st-4th Century CE",
    medium: "Gold, Silver, Copper",
  },
  "salar jung → bidriware": {
    title: "Bidriware Artifacts",
    artist: "Bidar Craftsmen",
    location: "Salar Jung Museum, Hyderabad",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Bidriware is a metal handicraft from Bidar, Karnataka, developed in the 14th century during the Bahmani Sultanate. This unique art form involves casting zinc and copper alloy, then inlaying it with silver or gold in intricate geometric and floral patterns. The distinctive black color comes from a special soil treatment that oxidizes the metal surface.",
      kids: "In the city of Bidar, artists learned to make beautiful metal objects that look black and shiny! They take a special mix of metals, make pots and boxes, then decorate them with silver designs. The black color comes from a special mud that they put on the metal. It's like magic - the mud turns the metal black but leaves the silver shining!",
    },
    funFact: {
      adult:
        "The soil used for blackening Bidriware is found only in Bidar and contains unique minerals that create the distinctive finish!",
      kids: "The special mud that makes Bidriware black is found only in one place in the whole world - Bidar! 🏺",
    },
    year: "14th Century CE - Present",
    medium: "Zinc-copper alloy with silver inlay",
  },
  "indian museum → pala manuscript": {
    title: "Pala Manuscript Paintings",
    artist: "Pala Period Scribes and Artists",
    location: "Indian Museum, Kolkata",
    image: "/placeholder.svg?height=600&width=400",
    backstory: {
      adult:
        "Pala manuscript paintings from the 8th-12th centuries CE represent the earliest surviving tradition of Indian book illustration. Created in Buddhist monasteries of Bengal and Bihar, these palm leaf manuscripts contain Buddhist texts illustrated with miniature paintings. The Pala style influenced art across Southeast Asia and is considered the precursor to later Indian miniature painting traditions.",
      kids: "Long before there were printed books, monks in Bengal wrote religious stories on palm leaves and decorated them with tiny, colorful pictures! These were like the first comic books in India. The monks used natural colors to paint gods, goddesses, and stories from Buddhism. These books were so beautiful that people in other countries copied this style!",
    },
    funFact: {
      adult: "Pala manuscripts were written on palm leaves that could last over 1000 years in the right conditions!",
      kids: "These books were written on leaves from palm trees, and some of them are still readable after 1000 years! 📚",
    },
    year: "8th-12th Century CE",
    medium: "Natural pigments on palm leaves",
  },
}

// Indian Museums and their highlights
const indianMuseums = {
  "national museum": {
    name: "National Museum, New Delhi",
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

export default function ArtNavigator() {
  const [query, setQuery] = useState("")
  const [selectedArt, setSelectedArt] = useState(null)
  const [isKidsMode, setIsKidsMode] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showMuseumMap, setShowMuseumMap] = useState(false)
  const [selectedMuseum, setSelectedMuseum] = useState(null)
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

  // Reset audio when changing artwork or mode
  useEffect(() => {
    stopAudio()
  }, [selectedArt, isKidsMode])

  const handleSearch = (searchQuery: string) => {
    const normalizedQuery = searchQuery.toLowerCase().trim()
    const artwork = artworks[normalizedQuery]

    if (artwork) {
      setSelectedArt(artwork)
      setZoomLevel(1)
      setShowFavorites(false)
      setShowMuseumMap(false)
    } else {
      // Show suggestion for partial matches
      const suggestions = Object.keys(artworks).filter(
        (key) => key.includes(normalizedQuery) || normalizedQuery.includes(key.split(" → ")[1]?.split(" ")[0] || ""),
      )
      if (suggestions.length > 0) {
        setSelectedArt(artworks[suggestions[0]])
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
    "National Museum → Ashoka Pillar",
    "Ajanta Caves → Bodhisattva Padmapani",
    "Government Museum → Tanjore Painting",
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
      const backstory = isKidsMode ? selectedArt.backstory.kids : selectedArt.backstory.adult
      const funFact = isKidsMode ? selectedArt.funFact.kids : selectedArt.funFact.adult
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
    const favorites = JSON.parse(localStorage.getItem("artFavorites") || "[]")
    const artworkData = {
      id: selectedArt.title.toLowerCase().replace(/\s+/g, "-"),
      title: selectedArt.title,
      artist: selectedArt.artist,
      location: selectedArt.location,
      year: selectedArt.year,
    }

    const existingIndex = favorites.findIndex((fav) => fav.id === artworkData.id)
    if (existingIndex === -1) {
      favorites.push(artworkData)
      localStorage.setItem("artFavorites", JSON.stringify(favorites))
      alert(`${selectedArt.title} saved to favorites!`)
    } else {
      alert(`${selectedArt.title} is already in your favorites!`)
    }
  }

  const handleMuseumMapSearch = (museumQuery: string) => {
    const normalizedQuery = museumQuery.toLowerCase().trim()
    const museum = indianMuseums[normalizedQuery]

    if (museum) {
      setSelectedMuseum(museum)
      setShowMuseumMap(true)
      setSelectedArt(null)
      setShowFavorites(false)
    } else {
      // Try partial matching
      const suggestions = Object.keys(indianMuseums).filter(
        (key) => key.includes(normalizedQuery) || normalizedQuery.includes(key),
      )
      if (suggestions.length > 0) {
        setSelectedMuseum(indianMuseums[suggestions[0]])
        setShowMuseumMap(true)
        setSelectedArt(null)
        setShowFavorites(false)
      } else {
        alert(
          "Museum not found. Try: National Museum, Indian Museum, Prince of Wales, Salar Jung, Government Museum, or Ajanta Caves",
        )
      }
    }
  }

  const showFavoritesPage = () => {
    setShowFavorites(true)
    setSelectedArt(null)
    setShowMuseumMap(false)
  }

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem("artFavorites") || "[]")
  }

  const removeFavorite = (id: string) => {
    const favorites = getFavorites().filter((fav) => fav.id !== id)
    localStorage.setItem("artFavorites", JSON.stringify(favorites))
    setShowFavorites(true) // Refresh the view
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            3-Second Art Navigator
          </h1>
          <p className="text-gray-600">Explore India's Rich Cultural Heritage</p>
          <div className="text-sm text-orange-600 font-medium">
            ✨ Now featuring {Object.keys(artworks).length} famous Indian artifacts!
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant={!showFavorites && !showMuseumMap ? "default" : "outline"}
            onClick={() => {
              setShowFavorites(false)
              setShowMuseumMap(false)
              setSelectedArt(null)
            }}
          >
            🎨 Artworks
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
              setSelectedArt(null)
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
              >
                {showMuseumMap ? "Find Museum" : "Navigate"}
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
                Your Favorite Artworks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getFavorites().length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💔</div>
                  <p className="text-gray-600">No favorites saved yet!</p>
                  <p className="text-sm text-gray-500 mt-2">Search for artworks and save them to see them here.</p>
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

        {/* Museum Map */}
        {showMuseumMap && selectedMuseum && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-500" />
                {selectedMuseum.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Must-Visit Highlights:</h3>
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        {selectedArt && (
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
        {selectedArt && (
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
        {selectedArt && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Panel */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">🏛️</div>
                    <p className="text-lg font-medium">{selectedArt.title}</p>
                    <p className="text-sm">{selectedArt.artist}</p>
                    <p className="text-xs mt-2">{selectedArt.year}</p>
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
                      <CardTitle className="text-2xl">{selectedArt.title}</CardTitle>
                      <p className="text-lg text-gray-600 mt-1">{selectedArt.artist}</p>
                    </div>
                    <Badge variant="secondary">{selectedArt.year}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>{selectedArt.location}</span>
                    <span>•</span>
                    <span>{selectedArt.medium}</span>
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
                        {isKidsMode ? selectedArt.backstory.kids : selectedArt.backstory.adult}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">💡 Did You Know?</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {isKidsMode ? selectedArt.funFact.kids : selectedArt.funFact.adult}
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
        {!selectedArt && !showFavorites && !showMuseumMap && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🏛️</div>
                <h2 className="text-2xl font-semibold">Explore India's Cultural Treasures</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Discover {Object.keys(artworks).length} famous Indian artifacts spanning over 5000 years of history!
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
