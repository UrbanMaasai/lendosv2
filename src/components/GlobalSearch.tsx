import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, FileText, Package, Building2, ArrowRight } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface SearchResult {
  id: string;
  type: 'borrower' | 'loan' | 'product' | 'tenant';
  title: string;
  subtitle: string;
  icon: any;
  path: string;
  tenantName?: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search borrowers
    dataLayer.getBorrowers().forEach(b => {
      if (b.name.toLowerCase().includes(q) || b.phone.includes(q) || b.idNumber.includes(q)) {
        const tenant = dataLayer.getTenant(b.tenantId);
        searchResults.push({
          id: b.id,
          type: 'borrower',
          title: b.name,
          subtitle: `${b.phone} · ${b.kycVerified ? 'Verified' : 'Pending KYC'}`,
          icon: Users,
          path: '/app/borrowers',
          tenantName: tenant?.name,
        });
      }
    });

    // Search loans
    dataLayer.getLoans().forEach(l => {
      const borrower = dataLayer.getBorrower(l.borrowerId);
      if (l.id.toLowerCase().includes(q) || borrower?.name.toLowerCase().includes(q)) {
        const tenant = dataLayer.getTenant(l.tenantId);
        searchResults.push({
          id: l.id,
          type: 'loan',
          title: l.id,
          subtitle: `${borrower?.name} · KES ${l.principal.toLocaleString()} · ${l.status}`,
          icon: FileText,
          path: '/app/loans',
          tenantName: tenant?.name,
        });
      }
    });

    // Search products
    dataLayer.getProducts().forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        const tenant = dataLayer.getTenant(p.tenantId);
        searchResults.push({
          id: p.id,
          type: 'product',
          title: p.name,
          subtitle: `APR ${p.config.apr}% · ${p.config.minAmount.toLocaleString()}-${p.config.maxAmount.toLocaleString()}`,
          icon: Package,
          path: '/app/products',
          tenantName: tenant?.name,
        });
      }
    });

    // Search tenants
    dataLayer.getTenants().forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.subdomain.toLowerCase().includes(q)) {
        searchResults.push({
          id: t.id,
          type: 'tenant',
          title: t.name,
          subtitle: `${t.tier} tier · ${t.status}`,
          icon: Building2,
          path: '/app/tenants',
        });
      }
    });

    setResults(searchResults.slice(0, 10));
    setSelectedIndex(0);
  }, [query]);

  const handleNavigate = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    navigate(result.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleNavigate(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/50" onClick={() => { setIsOpen(false); setQuery(''); }}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search borrowers, loans, products, tenants..."
            className="flex-1 text-base outline-none text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={() => { setIsOpen(false); setQuery(''); }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Type to search across all entities</p>
              <p className="text-xs mt-2 text-gray-400">Press ⌘K or Ctrl+K to open search</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleNavigate(result)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  result.type === 'borrower' ? 'bg-primary-50' :
                  result.type === 'loan' ? 'bg-accent-50' :
                  result.type === 'product' ? 'bg-purple-50' :
                  'bg-warning-50'
                }`}>
                  <result.icon size={16} className={
                    result.type === 'borrower' ? 'text-primary-600' :
                    result.type === 'loan' ? 'text-accent-600' :
                    result.type === 'product' ? 'text-purple-600' :
                    'text-warning-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                  {result.tenantName && (
                    <p className="text-xs text-gray-400 mt-0.5">{result.tenantName}</p>
                  )}
                </div>
                <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Close</span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
