import Link from "next/link";
import PageHeader from "../../components/PageHeader";

export default function ThemePage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 p-6 md:p-12 lg:p-20">
      <PageHeader 
        title="Theme"
        subtitle="다양한 테마의 파티를 탐색해보세요."
      />

      <section>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-72 h-56 bg-red-500 rounded-xl shadow-lg flex items-center justify-center text-white text-3xl font-bold cursor-pointer transform hover:scale-105 transition-transform">
            크리스마스
            <Link href="/invitation?theme=christmas" className="absolute inset-0" />
          </div>
          <div className="w-72 h-56 bg-sky-500 rounded-xl shadow-lg flex items-center justify-center text-white text-3xl font-bold cursor-pointer transform hover:scale-105 transition-transform">
            동창회
            <Link href="/invitation?theme=reunion" className="absolute inset-0" />
          </div>
        </div>
      </section>
    </div>
  );
}
