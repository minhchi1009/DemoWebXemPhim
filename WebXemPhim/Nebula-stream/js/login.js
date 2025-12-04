const { useState, useEffect } = React;
// Kiểm tra icon đã load chưa
const Icons = window.lucideReact || {};
// Import các icon cần thiết cho trang login
const { Mail, Lock, User, ArrowRight, Eye, EyeOff, X } = Icons;

// Ảnh nền ngẫu nhiên lấy cảm hứng từ phim ảnh
const BG_IMAGE = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1920&q=80";

const LoginPage = () => {
    // State quản lý chế độ: 'login' hoặc 'signup'
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // State quản lý dữ liệu nhập liệu (MỚI)
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    // Xử lý đăng nhập/đăng ký
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Xác định tên hiển thị
        let userDisplayName = "";
        
        if (isLoginMode) {
            // Nếu đăng nhập: Lấy phần tên trước @ của email làm tên hiển thị (Vì chưa có Database thật)
            userDisplayName = email.split('@')[0];
        } else {
            // Nếu đăng ký: Lấy tên người dùng nhập vào
            userDisplayName = fullName;
        }

        // 2. Lưu vào localStorage (Bộ nhớ trình duyệt)
        // Đây là bước quan trọng để trang chủ (index.html) biết ai đã đăng nhập
        localStorage.setItem("nebula_user", userDisplayName);
        localStorage.setItem("nebula_is_logged_in", "true");

        // 3. Thông báo và chuyển hướng
        // alert(isLoginMode ? `Chào mừng trở lại, ${userDisplayName}!` : `Đăng ký thành công! Chào ${userDisplayName}`);
        
        // Chuyển hướng về trang chủ
        window.location.href = 'index.html';
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <img src={BG_IMAGE} alt="bg" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/80 to-transparent"></div>
            </div>

            {/* Logo ở góc trái */}
            <div className="absolute top-8 left-8 z-20 cursor-pointer" onClick={() => window.location.href = 'index.html'}>
                <h1 className="text-3xl font-black tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">NEBULA</span>
                    <span className="text-white">STREAM</span>
                </h1>
            </div>

            {/* Form Card */}
            <div className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in mx-4">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isLoginMode ? "Chào mừng trở lại" : "Tham gia vũ trụ"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLoginMode 
                            ? "Sẵn sàng để tiếp tục chuyến hành trình điện ảnh?" 
                            : "Tạo tài khoản để mở khóa kho phim không giới hạn."}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Input Tên (Chỉ hiện khi Đăng ký) */}
                    {!isLoginMode && (
                        <div className="space-y-2 group">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên hiển thị</label>
                            <div className="relative">
                                {User && <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />}
                                <input 
                                    type="text" 
                                    placeholder="Ví dụ: NeonRider" 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-gray-600"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Input Email */}
                    <div className="space-y-2 group">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            {Mail && <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />}
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-gray-600"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="space-y-2 group">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
                        <div className="relative">
                            {Lock && <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />}
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-gray-600"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (EyeOff && <EyeOff size={18} />) : (Eye && <Eye size={18} />)}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link (Chỉ hiện khi Login) */}
                    {isLoginMode && (
                        <div className="text-right">
                            <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Quên mật khẩu?</a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>{isLoginMode ? "Đăng Nhập" : "Tạo Tài Khoản"}</span>
                        {ArrowRight && <ArrowRight size={20} />}
                    </button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-8 text-center pt-6 border-t border-white/10">
                    <p className="text-gray-400 text-sm">
                        {isLoginMode ? "Chưa có tài khoản? " : "Đã là thành viên? "}
                        <button 
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="text-white font-bold hover:text-cyan-400 transition-colors ml-1"
                        >
                            {isLoginMode ? "Đăng ký ngay" : "Đăng nhập"}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginPage />);