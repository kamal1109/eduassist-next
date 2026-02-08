export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner Modern */}
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>

                {/* Teks Branding */}
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">
                    Memuat EduAssist...
                </p>
            </div>
        </div>
    );
}