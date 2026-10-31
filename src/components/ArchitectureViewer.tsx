import React, { useState, useMemo } from 'react';
import { ARCHITECTURE_SPECIFICATIONS, ArchitectureSection } from '../data/architectureDocs';
import { 
  BookOpen, 
  Search, 
  Check, 
  Copy, 
  Download, 
  FileCode, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(ARCHITECTURE_SPECIFICATIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(ARCHITECTURE_SPECIFICATIONS.map(s => s.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  const filteredSections = useMemo(() => {
    return ARCHITECTURE_SPECIFICATIONS.filter(section => {
      const matchesSearch =
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || section.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const currentSection =
    ARCHITECTURE_SPECIFICATIONS.find(s => s.id === selectedSectionId) ||
    filteredSections[0] ||
    ARCHITECTURE_SPECIFICATIONS[0];

  const handleCopyContent = () => {
    navigator.clipboard.writeText(
      `# ${currentSection.number}. ${currentSection.title}\n${currentSection.subtitle}\n\n${currentSection.content}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const fullDoc = ARCHITECTURE_SPECIFICATIONS.map(
      s => `# ${s.number}. ${s.title}\n**${s.subtitle}** (Category: ${s.category})\n\n${s.content}\n\n---\n`
    ).join('\n');

    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ECHO_MASTER_SPECIFICATION_20_DELIVERABLES.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              ECHO Master Architecture & Specifications Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive repository of all 20 engineering deliverables specified in Part 22.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyContent}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Section'}</span>
          </button>
          <button
            onClick={handleDownloadAll}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All 20 Specs (.MD)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Content Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & 20 Items List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specifications..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of 20 Deliverables */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2 shadow-xs max-h-[620px] overflow-y-auto space-y-1">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`w-full text-left p-3 rounded-2xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                  selectedSectionId === sec.id
                    ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div>
                  <div className="font-semibold flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {sec.number}
                    </span>
                    <span className="line-clamp-1">{sec.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 pl-6">
                    {sec.subtitle}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Document Content Reader */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
                  Deliverable #{currentSection.number}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-semibold">
                  {currentSection.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {currentSection.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Markdown Body Formatted Display */}
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentSection.content
                    .replace(/### (.*)/g, '<h4 class="text-sm font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>')
                    .replace(/```(text|sql|css)?([\s\S]*?)```/g, '<pre class="bg-slate-950 text-teal-400 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800 my-3 leading-normal">$2</pre>')
                    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-teal-700 dark:text-teal-300">$1</code>')
                    .replace(/\n- (.*)/g, '<li class="ml-4 list-disc my-1">$1</li>')
                    .replace(/\| (.*) \|/g, (match) => {
                      return `<div class="font-mono text-[11px] py-0.5">${match}</div>`;
                    }),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
