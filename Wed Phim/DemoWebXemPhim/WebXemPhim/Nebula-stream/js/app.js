// js/app.js

const { useState, useEffect, useRef } = React;

// --- 1. ICON AN TOÀN (Cơ chế chống sập web) ---
const Icons = window.lucideReact || {};
const SafeIcon = (iconName, fallbackChar) => {
    // Kiểm tra xem Icon có tồn tại trong thư viện không
    const IconComp = Icons[iconName];
    // Nếu có thì render Icon, không thì render ký tự thay thế
    return IconComp ? IconComp : () => <span className="font-bold px-2 text-lg">{fallbackChar}</span>;
};

// Khai báo lại toàn bộ icon
const Play = SafeIcon('Play', '▶');
const Info = SafeIcon('Info', 'i');
const Search = SafeIcon('Search', '🔍');
const Bell = SafeIcon('Bell', '🔔');
const X = SafeIcon('X', '✕');
const Star = SafeIcon('Star', '★');
const TrendingUp = SafeIcon('TrendingUp', '📈');
const ChevronRight = SafeIcon('ChevronRight', '>');
const ChevronLeft = SafeIcon('ChevronLeft', '<');
const ThumbsUp = SafeIcon('ThumbsUp', '👍');
const MessageSquare = SafeIcon('MessageSquare', '💬');
const Share2 = SafeIcon('Share2', '🔗');
const User = SafeIcon('User', '👤');
const Heart = SafeIcon('Heart', '❤️');
const Volume2 = SafeIcon('Volume2', '🔊');
const Plus = SafeIcon('Plus', '+');
const Film = SafeIcon('Film', '🎬');
const Server = SafeIcon('Server', '🌐'); // Icon Server

const API_KEY = "ae2da519"; 
const API_URL = "https://www.omdbapi.com/";

// DANH SÁCH SERVER
const MOVIE_SERVERS = [
    { id: 1, name: "Server VIP (VidSrc)", url: "https://vidsrc.xyz/embed/movie" },
    { id: 2, name: "Server Dự Phòng (AutoEmbed)", url: "https://player.autoembed.cc/embed/movie" }
];

const BLOCKBUSTER_POOL = [
    "Dune: Part Two", "Oppenheimer", "Avatar: The Way of Water", "The Batman",
    "Top Gun: Maverick", "Avengers: Endgame",
    "Interstellar", "Inception", "The Dark Knight", "Blade Runner 2049",
    "Godzilla x Kong: The New Empire", "Deadpool & Wolverine", "Civil War",
    "Furiosa: A Mad Max Saga", "Kingdom of the Planet of the Apes",
    "Everything Everywhere All At Once", "Joker", "Guardians of the Galaxy Vol. 3", 
    "Cyberpunk: Edgerunners", "Arcane"
];

const TRAILER_MAP = {
    "Dune: Part Two": "Way9Dexny3w",
    "Oppenheimer": "uYPbbksJxIg",
    "Avatar: The Way of Water": "o5F8MOz_IDw    ",
    "The Batman": "mqqft2x_Aa4",
    "Top Gun: Maverick": "giXco2jaZ_4",
    "Avengers: Endgame": "TcMBFSGVi1c",
    "Interstellar": "zSWdZVtXT7E",
    "Inception": "YoHD9XEInc0",
    "The Dark Knight": "EXeTwQWrcwY",
    "Blade Runner 2049": "gCcx85zbxz4",
    "Godzilla x Kong: The New Empire": "lV1OOlGwExM",
    "Deadpool & Wolverine": "73_1biilkYk",
    "Civil War": "aDyQxtg0V2w",
    "Furiosa: A Mad Max Saga": "XJMuhwVlca4",
    "Kingdom of the Planet of the Apes": "K7eM_K9yqQY",
    "Joker": "zAGVQLHvwOY",
    "Guardians of the Galaxy Vol. 3": "u3V5KDWgQqE",
    "Cyberpunk: Edgerunners": "JtqIas3bYhg",
    "Arcane": "fXmAurh012s",
    "Everything Everywhere All At Once": "wxN1T1uxQ2g",
    "Spider-Man: Across the Spider-Verse": "shW9i6k8cB0"
};

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- COMPONENTS ---

const Navigation = ({ isScrolled, onLoginClick }) => {
    const [username, setUsername] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("nebula_user");
        if (storedUser) setUsername(storedUser);
    }, []);
    const handleLogout = () => {
        if (confirm("Đăng xuất?")) {
            localStorage.removeItem("nebula_user");
            window.location.reload();
        }
    };
    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#141414]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black tracking-tighter cursor-pointer group">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">NEBULA</span>
                        <span className="text-white">STREAM</span>
                    </h1>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
                        <a href="#" className="text-white font-bold">Trang chủ</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Phim bộ</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Phim lẻ</a>
                    </div>
                </div>
                <div className="flex items-center gap-5 text-gray-300">
                    <div className="hidden md:flex items-center bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5">
                        <Search size={18} />
                        <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none text-sm ml-2 w-24 text-white"/>
                    </div>
                    <Bell size={20} className="cursor-pointer hover:text-white" />
                    {username ? (
                        <div onClick={handleLogout} className="cursor-pointer w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1px]">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} className="rounded-full bg-black" />
                        </div>
                    ) : (
                        <div onClick={onLoginClick} className="cursor-pointer hover:text-cyan-400 transition-colors">
                            <User size={20} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const Hero = ({ movie, onPlayTrailer, onWatchMovie, onInfo }) => {
    if (!movie) return <div className="h-screen flex items-center justify-center text-cyan-500 font-bold tracking-widest animate-pulse">LOADING NEBULA...</div>;
    return (
        <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden">
            <div className="absolute inset-0">
                <img src={movie.image} className="w-full h-full object-cover opacity-60 blur-sm scale-110 animate-pan-slow" onError={(e) => e.target.src='https://via.placeholder.com/1920x1080'} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex items-center px-4 md:px-12 max-w-7xl mx-auto pt-20 pb-32">
                <div className="max-w-3xl space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-gray-200 font-medium text-lg">
                        <span className="text-green-400 font-bold">{movie.match} Match</span>
                        <span>{movie.year}</span>
                        <span className="border border-gray-500 px-2 text-sm rounded">{movie.rated}</span>
                    </div>
                    <p className="text-gray-300 text-lg line-clamp-3 max-w-xl text-shadow-md">{movie.description}</p>
                    <div className="flex gap-4 pt-4">
                        <button onClick={onWatchMovie} className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-colors text-xl">
                            <Play size={24} className="fill-black"/> Xem Phim
                        </button>
                        <button onClick={onPlayTrailer} className="flex items-center gap-3 px-8 py-3 bg-[#6d6d6eb3] text-white font-bold rounded hover:bg-[#6d6d6e66] transition-colors text-xl">
                            <Film size={24} /> Trailer
                        </button>
                        <button onClick={onInfo} className="flex items-center gap-3 px-8 py-3 bg-[#6d6d6eb3] text-white font-bold rounded hover:bg-[#6d6d6e66] transition-colors text-xl">
                            <Info size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MovieCard = ({ movie, onClick }) => (
    <div onClick={() => onClick(movie)} className="relative group min-w-[150px] md:min-w-[200px] aspect-[2/3] rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20 hover:shadow-xl">
        <img src={movie.image} className="w-full h-full object-cover" onError={(e) => e.target.src='https://via.placeholder.com/300x450'} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
    </div>
);

const MovieRow = ({ title, movies, onMovieClick }) => {
    const rowRef = useRef(null);
    const scroll = (direction) => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = window.innerWidth / 1.5; 
            const scrollPos = direction === 'left' ? -scrollAmount : scrollAmount;
            current.scrollBy({ left: scrollPos, behavior: 'smooth' });
        }
    };
    if (!movies || movies.length === 0) return null;
    return (
        <div className="py-6 space-y-3 group relative z-20 pl-4 md:pl-12">
            <h3 className="text-xl font-bold text-[#e5e5e5] hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                {title} <span className="text-sm text-cyan-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Xem tất cả &gt;</span>
            </h3>
            <div className="relative group/slider">
                 <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-sm cursor-pointer">
                    <ChevronLeft size={40} />
                </button>
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth pr-12" ref={rowRef}>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                    ))}
                </div>
                <button onClick={() => scroll('right')} className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-sm cursor-pointer">
                    <ChevronRight size={40} />
                </button>
            </div>
        </div>
    );
};

const MovieDetailModal = ({ movie, onClose, onPlayTrailer, onWatchMovie }) => {
    if (!movie) return null;
    
    const youtubeId = TRAILER_MAP[movie.title] || "Way9Dexny3w"; 
    const videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`;

    const handleContentClick = (e) => e.stopPropagation();

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-6xl bg-[#141414] rounded-xl overflow-hidden shadow-2xl animate-fade-in-up ring-1 ring-white/10 flex flex-col md:flex-row h-[85vh] md:h-[600px]" onClick={handleContentClick}>
                <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/60 p-2 rounded-full hover:bg-white/20 transition text-white">
                    <X size={24} />
                </button>

                {/* CỘT TRÁI: THÔNG TIN */}
                <div className="w-full md:w-[40%] p-8 overflow-y-auto flex flex-col justify-between bg-gradient-to-r from-black to-[#141414] relative z-10">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{movie.title}</h2>
                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                <span className="text-green-400 font-bold">{movie.match} Match</span>
                                <span>{movie.year}</span>
                                <span className="border border-gray-500 px-1.5 rounded text-xs">{movie.rated}</span>
                                <span>{movie.duration}</span>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm md:text-base border-l-2 border-cyan-500 pl-4">
                            {movie.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p><strong className="text-white">Diễn viên:</strong> {movie.actors}</p>
                            <p><strong className="text-white">Đạo diễn:</strong> {movie.director}</p>
                            <p><strong className="text-white">Thể loại:</strong> {movie.genre}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-6 mt-4 border-t border-white/10">
                        <button onClick={() => onWatchMovie(movie)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition">
                            <Play size={20} className="fill-black"/> Xem Phim
                        </button>
                        <button onClick={() => onPlayTrailer(movie)} className="p-3 border border-gray-500 rounded hover:border-white hover:text-white text-gray-400 transition" title="Xem Trailer Full">
                            <Film size={20} />
                        </button>
                    </div>
                </div>

                {/* CỘT PHẢI: VIDEO TRAILER */}
                <div className="w-full md:w-[60%] h-64 md:h-full bg-black relative">
                    <div className="absolute inset-0">
                        <iframe 
                            src={videoSrc}
                            title={movie.title}
                            className="w-full h-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            frameBorder="0"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- VIDEO PLAYER (CÓ CHỌN SERVER) ---
const VideoPlayer = ({ onClose, movie, mode }) => {
    // State chọn server (1 hoặc 2)
    const [currentServer, setCurrentServer] = useState(1);

    let videoSrc = "";
    let playerTitle = "";

    if (mode === 'trailer') {
        const youtubeId = TRAILER_MAP[movie.title] || ""; 
        videoSrc = youtubeId 
            ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0`
            : `https://www.youtube.com/embed?listType=search&list=trailer+${encodeURIComponent(movie.title)}`;
        playerTitle = `${movie.title} - Official Trailer`;
    } else {
        // Lấy link server theo ID đã chọn
        const serverConfig = MOVIE_SERVERS.find(s => s.id === currentServer);
        videoSrc = `${serverConfig.url}/${movie.id}`;
        playerTitle = `Đang xem: ${movie.title}`;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#0b0c15] animate-fade-in flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center p-4 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <h2 className="text-white font-bold text-lg truncate px-2 border-l-4 border-cyan-500">{playerTitle}</h2>
                    {mode === 'movie' && <span className="bg-red-600 text-xs px-2 py-0.5 rounded font-bold">SERVER {currentServer}</span>}
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors text-white">
                    <X size={24} />
                </button>
            </div>
            
            <div className="w-full bg-black aspect-video relative shadow-2xl flex-shrink-0">
                <iframe 
                    key={videoSrc} // Reload iframe khi đổi src
                    src={videoSrc}
                    title={movie.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    frameBorder="0"
                    referrerPolicy="origin"
                ></iframe>
            </div>

            {/* Khu vực chọn server */}
            {mode === 'movie' && (
                <div className="max-w-7xl mx-auto w-full p-6 md:p-8">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {Server && <Server size={20} className="text-cyan-400"/>} Chọn Nguồn Phát
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">Nếu Server 1 lỗi, hãy thử Server 2.</p>
                            </div>
                            
                            <div className="flex gap-2">
                                {MOVIE_SERVERS.map(server => (
                                    <button
                                        key={server.id}
                                        onClick={() => setCurrentServer(server.id)}
                                        className={`px-4 py-2 rounded font-bold text-sm transition-all flex items-center gap-2 border ${
                                            currentServer === server.id 
                                            ? 'bg-cyan-500 border-cyan-500 text-black' 
                                            : 'bg-black/30 border-white/10 text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {Server && <Server size={16} />}
                                        {server.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [heroMovie, setHeroMovie] = useState(null);
    const [trendingNow, setTrendingNow] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [detailMovie, setDetailMovie] = useState(null);
    const [playingMovie, setPlayingMovie] = useState(null);
    const [playerMode, setPlayerMode] = useState('trailer');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            const shuffled = shuffleArray([...BLOCKBUSTER_POOL]);
            const heroTitle = shuffled[0]; 
            const trendingTitles = shuffled.slice(1, 9);
            const topTitles = shuffled.slice(9, 17);

            const getDetails = async (titles) => {
                const promises = titles.map(t => fetch(`${API_URL}?t=${encodeURIComponent(t)}&apikey=${API_KEY}`).then(res => res.json()));
                const data = await Promise.all(promises);
                return data.filter(item => item.Response === "True").map(item => ({
                    id: item.imdbID,
                    title: item.Title,
                    description: item.Plot,
                    image: (item.Poster && item.Poster !== "N/A") ? item.Poster : "https://via.placeholder.com/300x450",
                    year: item.Year,
                    imdbRating: item.imdbRating,
                    match: item.imdbRating !== "N/A" ? Math.round(parseFloat(item.imdbRating) * 10) + "%" : "95%",
                    genre: item.Genre,
                    rated: item.Rated,
                    duration: item.Runtime,
                    actors: item.Actors,
                    director: item.Director
                }));
            };

            try {
                const [heroData, trendingData, topData] = await Promise.all([
                    getDetails([heroTitle]),
                    getDetails(trendingTitles),
                    getDetails(topTitles)
                ]);

                if (heroData.length > 0) setHeroMovie(heroData[0]);
                setTrendingNow(trendingData);
                setTopRated(topData);
                setActionMovies([...trendingData].reverse());
            } catch (err) {
                console.error("Lỗi tải phim:", err);
            }
        };

        fetchMovies();
    }, []);

    const openDetail = (movie) => setDetailMovie(movie);
    const closeDetail = () => setDetailMovie(null);
    const openPlayer = (movie, mode) => {
        setDetailMovie(null);
        setPlayerMode(mode);
        setPlayingMovie(movie);
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-500/30 selection:text-white">
            <Navigation isScrolled={isScrolled} onLoginClick={() => window.location.href = 'login.html'} />
            <main>
                <Hero 
                    movie={heroMovie} 
                    onPlayTrailer={() => openPlayer(heroMovie, 'trailer')} 
                    onWatchMovie={() => openPlayer(heroMovie, 'movie')} 
                    onInfo={() => openDetail(heroMovie)} 
                />
                <div className="relative z-20 -mt-16 md:-mt-24 pb-20 bg-gradient-to-b from-transparent via-[#141414] to-[#141414]">
                    <MovieRow title="Hiện đang thịnh hành" movies={trendingNow} onMovieClick={openDetail} />
                    <MovieRow title="Tuyển tập Top Rated" movies={topRated} onMovieClick={openDetail} />
                    <MovieRow title="Phim Hành Động Bom Tấn" movies={actionMovies} onMovieClick={openDetail} />
                </div>
            </main>
            <footer className="py-10 text-center text-gray-500 text-xs border-t border-white/10 mt-10">
                <p>© 2024 Nebula Stream. Data provided by OMDb API.</p>
            </footer>
            {detailMovie && <MovieDetailModal movie={detailMovie} onClose={closeDetail} onPlayTrailer={() => openPlayer(detailMovie, 'trailer')} onWatchMovie={() => openPlayer(detailMovie, 'movie')} />}
            {playingMovie && <VideoPlayer movie={playingMovie} mode={playerMode} onClose={() => setPlayingMovie(null)} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);