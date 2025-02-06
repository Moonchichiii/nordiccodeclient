import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button onClick={onBack} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
      <ArrowLeft className="w-5 h-5" />
    </button>
    <h2 className="text-3xl font-light text-white">Customize Your Package</h2>
  </div>
);

export default Header;
