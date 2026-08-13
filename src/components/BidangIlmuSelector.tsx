import React, { useState } from 'react';
import { CATEGORIZED_BIDANG_ILMU, ALL_BIDANG_ILMU } from '../data/bidangIlmu';
import { Search, GraduationCap, Check, BookOpen, Layers, X } from 'lucide-react';

interface BidangIlmuSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export function BidangIlmuDatalist() {
  return (
    <datalist id="bidang-ilmu-list">
      {ALL_BIDANG_ILMU.map((item, idx) => (
        <option key={idx} value={item} />
      ))}
    </datalist>
  );
}

export default function BidangIlmuSelector({
  value,
  onChange,
  placeholder = 'Contoh: Pendidikan Matematika, Teknik Informatika, dll.',
  className = '',
  id,
  name = 'major',
  required = false,
}: BidangIlmuSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredCategories = CATEGORIZED_BIDANG_ILMU.map(cat => {
    const matchedItems = cat.items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...cat,
      items: matchedItems
    };
  }).filter(cat => selectedCategory === 'Semua' || cat.category === selectedCategory)
    .filter(cat => cat.items.length > 0);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <BidangIlmuDatalist />
      
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type="text"
          list="bidang-ilmu-list"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={className || "w-full pl-3 pr-24 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors"}
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute right-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-emerald-200 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Katalog ({ALL_BIDANG_ILMU.length})
        </button>
      </div>

      {/* Interactive Catalog Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Katalog Bidang Ilmu / Program Studi</h3>
                  <p className="text-xs text-slate-500">Pilih dari {ALL_BIDANG_ILMU.length}+ Program Studi terdaftar (S1, S2, S3, Vokasi & Kedokteran)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filters */}
            <div className="p-4 border-b border-slate-100 bg-white space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari Program Studi (misal: Pendidikan Matematika, Teknik Informatika, Keperawatan, Hukum Islam)..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  autoFocus
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Semua')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                    selectedCategory === 'Semua' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Kategori
                </button>
                {CATEGORIZED_BIDANG_ILMU.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                      selectedCategory === cat.category 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.category} ({cat.items.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Content list */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Program Studi tidak ditemukan</p>
                  <p className="text-xs text-slate-500 mt-1">Anda bisa langsung mengetikkan nama Program Studi secara manual pada form.</p>
                </div>
              ) : (
                filteredCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {cat.category} ({cat.items.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {cat.items.map((item, itemIdx) => {
                        const isSelected = value === item;
                        return (
                          <button
                            key={itemIdx}
                            type="button"
                            onClick={() => handleSelect(item)}
                            className={`px-3 py-2 rounded-lg text-xs text-left font-medium transition-all flex items-center justify-between border ${
                              isSelected 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' 
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800'
                            }`}
                          >
                            <span className="truncate pr-1">{item}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
              <span>Tidak menemukan prodi Anda? Ketik langsung di form utama.</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
