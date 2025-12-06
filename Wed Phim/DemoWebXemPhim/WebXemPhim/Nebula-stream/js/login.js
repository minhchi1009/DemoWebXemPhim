// js/login.js

const { useState, useEffect } = React;

// --- HỆ THỐNG ICON AN TOÀN ---
const Icons = window.lucideReact || {};
const SafeIcon = (iconName, fallbackChar) => {
    const IconComp = Icons[iconName];
    // Nếu icon lỗi, hiện text thay thế
    return IconComp ? IconComp : () => <span className="font-bold px-2">{fallbackChar}</span>;
};

// Khai báo icon an toàn
const Mail = SafeIcon('Mail', '✉');
const Lock = SafeIcon('Lock', '🔒');
const User = SafeIcon('User', '👤');
const ArrowRight = SafeIcon('ArrowRight', '→');
const Eye = SafeIcon('Eye', '👁');
const EyeOff = SafeIcon('EyeOff', '-');
const X = SafeIcon('X', '✕');

const BG_IMAGE = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1920&q=80";

const LoginPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            let userDisplayName = isLoginMode ? formData.email.split('@')[0] : formData.fullName;
            localStorage.setItem("nebula_user", userDisplayName);
            localStorage.setItem("nebula_is_logged_in", "true");
            window.location.href = 'index.html';
        }, 1500);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center">
            
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src={BG_IMAGE} alt="bg" className="w-full h-full object-cover opacity-40 animate-fade-in" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/80 to-transparent"></div>
            </div>

            {/* Nút Quay về */}
            <button 
                onClick={() => window.location.href = 'index.html'} 
                className="absolute top-6 right-6 z-30 text-white/50 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/5"
            >
                {X && <X size={24} />}
            </button>

            {/* Logo */}
            <div className="absolute top-8 left-8 z-20 cursor-pointer animate-fade-in" onClick={() => window.location.href = 'index.html'}>
                <h1 className="text-3xl font-black tracking-tighter select-none">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">NEBULA</span>
                    <span className="text-white">STREAM</span>
                </h1>
            </div>

            {/* Form */}
            <div className="relative z-10 w-full max-w-[420px] p-8 mx-4 animate-slide-up">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"></div>
                
                <div className="relative z-20">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {isLoginMode ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {isLoginMode ? "Đăng nhập để tiếp tục." : "Khám phá kho phim không giới hạn."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {!isLoginMode && (
                            <div className="space-y-1.5 group">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tên hiển thị</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                        {User && <User size={20} />}
                                    </div>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder-gray-500"
                                        placeholder="Ví dụ: Alex"
                                        required={!isLoginMode}
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5 group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                    {Mail && <Mail size={20} />}
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder-gray-500"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                    {Lock && <Lock size={20} />}
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder-gray-500"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? (EyeOff && <EyeOff size={20} />) : (Eye && <Eye size={20} />)}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
                        >
                            {isLoading ? "Đang xử lý..." : (isLoginMode ? "Đăng Nhập" : "Tạo Tài Khoản")}
                            {!isLoading && ArrowRight && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <p className="text-gray-400 text-sm">
                            {isLoginMode ? "Chưa có tài khoản? " : "Đã là thành viên? "}
                            <button 
                                onClick={() => {
                                    setIsLoginMode(!isLoginMode);
                                    setFormData({ email: "", fullName: "", password: "" });
                                }}
                                className="text-white font-bold hover:text-cyan-400 transition-colors ml-1 cursor-pointer underline decoration-transparent hover:decoration-cyan-400 underline-offset-4"
                            >
                                {isLoginMode ? "Đăng ký ngay" : "Đăng nhập"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginPage />);