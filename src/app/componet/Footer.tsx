export default function Footer({txt}: { txt: string }) {
    return (
        <footer className="bg-white border-t mt-12">
            <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-slate-500">{txt}</div>
        </footer>
    );
}