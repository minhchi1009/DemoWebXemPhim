// js/app.js

const { useState, useEffect, useRef } = React;

// --- 1. XỬ LÝ ICON AN TOÀN ---
const Icons = window.lucideReact || {};
const SafeIcon = (iconName, fallbackChar) => {
    const IconComp = Icons[iconName];
    return IconComp ? IconComp : () => <span className="inline-block font-bold text-lg px-1">{fallbackChar}</span>;
};
const { Play, Info, Search, Bell, X, Star, ChevronRight, User, Plus, TrendingUp } = Icons;

// --- 2. CẤU HÌNH API & KHO PHIM BOM TẤN ---
const API_KEY = "ae2da519"; 
const API_URL = "https://www.omdbapi.com/";

// ĐÂY LÀ "KHO" PHIM XỊN (GIỐNG NETFLIX DATABASE)
// Code sẽ bốc ngẫu nhiên từ đây để hiển thị, đảm bảo toàn phim hay.
const BLOCKBUSTER_POOL = [
    "Dune: Part Two", "Oppenheimer", "Avatar: The Way of Water", "The Batman",
    "Spider-Man: Across the Spider-Verse", "Top Gun: Maverick", "Avengers: Endgame",
    "Interstellar", "Inception", "The Dark Knight", "Blade Runner 2049",
    "Godzilla x Kong: The New Empire", "Deadpool & Wolverine", "Civil War",
    "Furiosa: A Mad Max Saga", "Kingdom of the Planet of the Apes",
    "Everything Everywhere All At Once", "Joker", "Guardians of the Galaxy Vol. 3",
    "Cyberpunk: Edgerunners", "Arcane", "Black Mirror"
];

// Hàm xáo trộn mảng (Fisher-Yates Shuffle) - Để mỗi lần F5 là thứ tự phim thay đổi
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

const Navigation = ({ isScrolled }) => {
    // ... (Giữ nguyên như cũ)
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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0f1020]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black tracking-tighter cursor-pointer select-none group">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">NEBULA</span>
                        <span className="text-white">STREAM</span>
                    </h1>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
                        <a href="#" className="text-white font-bold">Trang chủ</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Phim bộ</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Phim lẻ</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Mới & Phổ biến</a>
                    </div>
                </div>
                <div className="flex items-center gap-5 text-gray-300">
                    <div className="hidden md:flex items-center bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/5">
                        {Search && <Search size={18} />}
                        <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none text-sm ml-2 w-24 text-white"/>
                    </div>
                    {Bell && <Bell size={20} className="cursor-pointer hover:text-white" />}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[2px]">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Guest'}`} className="rounded-full bg-black h-full w-full object-cover" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

const Hero = ({ movie, onPlay }) => {
    if (!movie) return <div className="h-screen flex items-center justify-center text-cyan-500 font-bold tracking-widest animate-pulse">LOADING NEBULA...</div>;

    return (
        <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden font-sans">
            {/* Background Full màn hình */}
            <div className="absolute inset-0">
                <img src={movie.image} className="w-full h-full object-cover opacity-60 blur-sm scale-110 animate-pan-slow" onError={(e) => e.target.src='https://via.placeholder.com/1920x1080'} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/80 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex items-center px-4 md:px-12 max-w-7xl mx-auto pt-24">
                <div className="max-w-3xl space-y-6 animate-fade-in-up">
                    {/* Logo phim hoặc text tiêu đề cực lớn */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm flex items-center gap-1">
                            N <span className="font-normal">SERIES</span>
                        </span>
                        <span className="text-gray-300 text-sm font-bold tracking-widest uppercase">{movie.genre?.split(',')[0]}</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl tracking-tight">
                        {movie.title}
                    </h1>

                    <div className="flex items-center gap-4 text-gray-200 font-medium text-lg">
                        <span className="text-green-400 font-bold">{movie.match} Match</span>
                        <span>{movie.year}</span>
                        <span className="border border-gray-500 px-2 text-sm rounded">{movie.rated}</span>
                        <span className="text-sm bg-white/20 px-1 rounded">HD</span>
                    </div>

                    <p className="text-gray-300 text-lg line-clamp-3 max-w-xl text-shadow-md">
                        {movie.description}
                    </p>

                    <div className="flex gap-4 pt-4">
                        <button onClick={onPlay} className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-colors text-xl">
                            {Play && <Play size={24} className="fill-black"/>} Phát
                        </button>
                        <button className="flex items-center gap-3 px-8 py-3 bg-[#6d6d6eb3] text-white font-bold rounded hover:bg-[#6d6d6e66] transition-colors text-xl">
                            {Info && <Info size={24} />} Thông Tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MovieCard = ({ movie, onPlay }) => (
    <div onClick={onPlay} className="relative group min-w-[150px] md:min-w-[200px] aspect-[2/3] rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20 hover:shadow-xl">
        <img src={movie.image} className="w-full h-full object-cover" onError={(e) => e.target.src='https://via.placeholder.com/300x450'} />
        
        {/* Netflix-style hover info (đơn giản hóa) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-transparent group-hover:border-white/20"></div>
    </div>
);

const MovieRow = ({ title, movies, onPlay }) => {
    const rowRef = useRef(null);
    if (!movies || movies.length === 0) return null;

    return (
        <div className="py-6 space-y-3 group relative z-20 pl-4 md:pl-12">
            <h3 className="text-xl font-bold text-[#e5e5e5] hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                {title} <span className="text-sm text-cyan-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Xem tất cả &gt;</span>
            </h3>
            
            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth pr-12" ref={rowRef}>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onPlay={() => onPlay(movie)} />
                ))}
            </div>
        </div>
    );
};

// Video Player Modal
const VideoPlayer = ({ onClose, movie }) => (
    <div className="fixed inset-0 z-[100] bg-black animate-fade-in flex flex-col items-center justify-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-red-500 z-50 bg-black/50 p-2 rounded-full">
            {X && <X size={40} />}
        </button>
        <div className="w-full h-full relative">
            <img src={movie?.image} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-8 text-center px-4">{movie?.title}</h1>
                <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 uppercase tracking-widest">Đang tải phim...</p>
                <p className="text-xs text-gray-600 mt-2">(API OMDb chỉ cung cấp thông tin, không có video thật)</p>
            </div>
        </div>
    </div>
);

// --- MAIN APP ---
const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [heroMovie, setHeroMovie] = useState(null);
    
    // Chia ra 3 list phim để giao diện phong phú
    const [trendingNow, setTrendingNow] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);

    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- LOGIC: TẢI PHIM NGẪU NHIÊN TỪ KHO ---
    useEffect(() => {
        const fetchMovies = async () => {
            // 1. Xáo trộn danh sách để mỗi lần F5 là khác nhau
            const shuffled = shuffleArray([...BLOCKBUSTER_POOL]);
            
            // 2. Chia danh sách thành các nhóm nhỏ để gọi API (tránh gọi quá nhiều cùng lúc)
            // Lấy 1 phim làm Hero
            const heroTitle = shuffled[0]; 
            // Lấy 8 phim làm Trending
            const trendingTitles = shuffled.slice(1, 9);
            // Lấy 8 phim làm Top Rated
            const topTitles = shuffled.slice(9, 17);

            // Hàm hỗ trợ fetch dữ liệu
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
                    match: item.imdbRating !== "N/A" ? Math.round(parseFloat(item.imdbRating) * 10) + "%" : "90%",
                    genre: item.Genre,
                    rated: item.Rated
                }));
            };

            // Thực hiện fetch song song
            try {
                const [heroData, trendingData, topData] = await Promise.all([
                    getDetails([heroTitle]),
                    getDetails(trendingTitles),
                    getDetails(topTitles)
                ]);

                if (heroData.length > 0) setHeroMovie(heroData[0]);
                setTrendingNow(trendingData);
                setTopRated(topData);
                
                // Demo thêm 1 hàng Action lấy lại dữ liệu để lấp đầy giao diện
                setActionMovies([...trendingData].reverse());

            } catch (err) {
                console.error("Lỗi tải phim:", err);
            }
        };

        fetchMovies();
    }, []);

    const handlePlay = (movie) => setSelectedMovie(movie || heroMovie);

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-500/30 selection:text-white">
            <Navigation isScrolled={isScrolled} />
            
            <main>
                <Hero movie={heroMovie} onPlay={() => handlePlay(heroMovie)} />
                
                {/* Đẩy nội dung lên đè background hero để giống Netflix */}
                <div className="relative z-20 -mt-32 md:-mt-48 pb-20 bg-gradient-to-b from-transparent via-[#141414] to-[#141414]">
                    <MovieRow title="Hiện đang thịnh hành" movies={trendingNow} onPlay={handlePlay} />
                    <MovieRow title="Tuyển tập Top Rated" movies={topRated} onPlay={handlePlay} />
                    <MovieRow title="Phim Hành Động Bom Tấn" movies={actionMovies} onPlay={handlePlay} />
                </div>
            </main>

            <footer className="py-10 text-center text-gray-500 text-xs border-t border-white/10 mt-10">
                <p className="mb-2">Mô phỏng giao diện Streaming.</p>
                <p>© 2024 Nebula Stream. Data provided by OMDb API.</p>
            </footer>

            {selectedMovie && <VideoPlayer movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);